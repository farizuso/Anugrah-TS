<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pesanan;
use App\Models\LaporanPembelian;
use App\Models\Stok;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Total revenue dari seluruh pesanan
        $totalRevenue = Pesanan::sum('total');

        // Jumlah pembelian & penjualan dihitung dari jumlah pesanan
        $totalPurchases = LaporanPembelian::count();
        $totalSales = Pesanan::count();

        // Total stok
        $totalStock = Stok::sum('jumlah_stok');

        // Top 5 pelanggan dengan pembelian terbanyak
        $topCustomers = DB::table('pesanans')
            ->join('pelanggans', 'pesanans.pelanggan_id', '=', 'pelanggans.id')
            ->select(
                'pelanggans.nama_pelanggan as name',
                'pelanggans.no_hp as phone',
                DB::raw('SUM(pesanans.total) as total')
            )
            ->groupBy('pelanggans.id', 'pelanggans.nama_pelanggan', 'pelanggans.no_hp')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(function ($d) {
                return [
                    'name' => $d->name,
                    'phone' => $d->phone,
                    'totalAmount' => 'Rp ' . number_format($d->total, 0, ',', '.'),
                ];
            });

        // Grafik penjualan bulanan
        $monthlySales = Pesanan::whereNotNull('tgl_pesanan')
            ->selectRaw('MONTH(tgl_pesanan) as month, SUM(total) as total')
            ->groupByRaw('MONTH(tgl_pesanan)')
            ->orderByRaw('MONTH(tgl_pesanan)')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromDate(null, $item->month, 1)->translatedFormat('M'),
                    'total' => (int) $item->total,
                ];
            });

        // Data stok terendah
        $lowStockProducts = \App\Models\Produk::select('produks.nama_produk', 'stoks.jumlah_stok')
            ->join('stoks', 'produks.id', '=', 'stoks.produk_id')
            ->orderBy('stoks.jumlah_stok', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'nama' => $item->nama_produk,
                    'stok' => $item->jumlah_stok,
                ];
            });

        // 📊 Pendapatan dan Pengeluaran per Bulan untuk Laba Bersih
        $monthlyRevenue = DB::table('pesanans')
            ->whereNotNull('tgl_pesanan')
            ->selectRaw("DATE_FORMAT(tgl_pesanan, '%Y-%m') as bulan, SUM(total) as total_pendapatan")
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        $monthlyPurchases = DB::table('laporan_pembelians')
            ->whereNotNull('tgl_pembelian')
            ->selectRaw("DATE_FORMAT(tgl_pembelian, '%Y-%m') as bulan, SUM(total) as total_pengeluaran")
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        $monthlyData = [];

        foreach ($monthlyRevenue as $rev) {
            $monthlyData[$rev->bulan]['bulan'] = $rev->bulan;
            $monthlyData[$rev->bulan]['pendapatan'] = $rev->total_pendapatan;
            $monthlyData[$rev->bulan]['pengeluaran'] = 0;
        }

        foreach ($monthlyPurchases as $pur) {
            if (!isset($monthlyData[$pur->bulan])) {
                $monthlyData[$pur->bulan]['bulan'] = $pur->bulan;
                $monthlyData[$pur->bulan]['pendapatan'] = 0;
            }
            $monthlyData[$pur->bulan]['pengeluaran'] = $pur->total_pengeluaran;
        }

        foreach ($monthlyData as &$item) {
            $item['laba'] = $item['pendapatan'] - $item['pengeluaran'];
        }

        ksort($monthlyData); // urut berdasarkan bulan

        return Inertia::render('Admin/Dashboard/Index', [
            'totalRevenue' => $totalRevenue,
            'totalPurchases' => $totalPurchases,
            'totalSales' => $totalSales,
            'totalStock' => $totalStock,
            'recentSales' => $topCustomers,
            'monthlySales' => $monthlySales,
            'lowStockProducts' => $lowStockProducts,
            'monthlyFinance' => array_values($monthlyData), // <- dikirim ke frontend
        ]);
    }
}
