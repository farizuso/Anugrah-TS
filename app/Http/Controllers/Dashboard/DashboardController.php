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
        $totalStock = Stok::sum('jumlah_stok'); // Ganti sesuai nama kolom yang benar

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

        // Penjualan per bulan untuk grafik
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



        return Inertia::render('Admin/Dashboard/Index', [
            'totalRevenue' => $totalRevenue,
            'totalPurchases' => $totalPurchases,
            'totalSales' => $totalSales,
            'totalStock' => $totalStock,
            'recentSales' => $topCustomers,
            'monthlySales' => $monthlySales,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
