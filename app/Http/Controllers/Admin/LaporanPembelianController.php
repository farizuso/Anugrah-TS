<?php

namespace App\Http\Controllers\Admin;

use App\Models\LaporanPembelian;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\LaporanPembelianDetail;
use App\Models\Produk;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LaporanPembelianExport;
use App\Models\Stok;
use App\Models\StokLog;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LaporanPembelianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = LaporanPembelian::with(['details.produk', 'supplier'])->get();

        // Pastikan tgl_pembelian adalah objek Date
        $posts->transform(function ($post) {
            $post->tgl_pembelian = Carbon::parse($post->tgl_pembelian)->format('Y-m-d');

            return $post;
        });

        return Inertia::render('Admin/LaporanPembelian/Index', [
            'posts' => $posts
        ]);
    }

    public function getLaporanPembelianGudang()
    {
        $posts = LaporanPembelian::with(['details.produk', 'supplier'])->get();

        $posts->transform(function ($post) {
            $post->tgl_pembelian = Carbon::parse($post->tgl_pembelian)->format('Y-m-d');

            return $post;
        });

        return Inertia::render('StaffGudang/KonfirmasiPembelian/Index', [
            'posts' => $posts
        ]);
    }





    // Export Excel langsung download
    public function export(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        return Excel::download(new LaporanPembelianExport($startDate, $endDate), 'laporan_pembelian.xlsx');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tgl_pembelian' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'produk' => 'required|array|min:1',
            'produk.*.produk_id' => 'required|exists:produks,id',
            'produk.*.harga' => 'required|numeric|min:0',
            'produk.*.quantity' => 'required|numeric|min:1',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput()
                ->with('error', 'Validasi gagal. Silakan periksa kembali form Anda.');
        }

        try {
            $validated = $validator->validated();
            $tglFix = Carbon::parse($validated['tgl_pembelian'])->format('Y-m-d');

            DB::transaction(function () use ($validated, $tglFix) {
                $supplierId = $validated['supplier_id'];
                $supplier = Supplier::find($supplierId);

                $pembelian = LaporanPembelian::create([
                    'tgl_pembelian' => $tglFix,
                    'supplier_id' => $supplierId,
                    'keterangan' => $validated['keterangan'] ?? null,
                    'total' => collect($validated['produk'])->sum(fn($item) => $item['harga'] * $item['quantity']),
                ]);

                foreach ($validated['produk'] as $item) {
                    LaporanPembelianDetail::create([
                        'laporan_pembelian_id' => $pembelian->id,
                        'produk_id' => $item['produk_id'],
                        'harga' => $item['harga'],
                        'quantity' => $item['quantity'],
                    ]);
                }
            });

            return redirect()->route('admin.laporanpembelian.index')
                ->with('success', 'Data Laporan Pembelian berhasil disimpan');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat menambahkan data: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'tgl_pembelian' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'produk' => 'required|array|min:1',
            'produk.*.produk_id' => 'required|exists:produks,id',
            'produk.*.harga' => 'required|numeric|min:0',
            'produk.*.quantity' => 'required|numeric|min:1',
            'keterangan' => 'nullable|string',
        ]);

        try {
            $tglFix = Carbon::parse($validated['tgl_pembelian'])->format('Y-m-d');
        } catch (\Exception $e) {
            return back()->withErrors(['tgl_pembelian' => 'Format tanggal tidak valid.']);
        }

        DB::transaction(function () use ($validated, $id, $tglFix) {
            // Temukan laporan pembelian berdasarkan ID
            $laporanPembelian = LaporanPembelian::findOrFail($id);

            // Ambil supplier berdasarkan supplier_id
            $supplierId = $validated['supplier_id'];
            $supplier = Supplier::find($supplierId);
            $namaSupplier = $supplier?->nama_supplier;  // Nama supplier diambil dari relasi

            // Hitung total baru berdasarkan produk yang diupdate
            $totalBaru = collect($validated['produk'])->sum(fn($item) => $item['harga'] * $item['quantity']);

            // Update laporan pembelian
            $laporanPembelian->update([
                'tgl_pembelian' => $tglFix,
                'supplier_id' => $supplierId,
                'keterangan' => $validated['keterangan'] ?? null,
                'total' => $totalBaru,
            ]);

            // Hapus detail produk lama dan buat yang baru
            $laporanPembelian->details()->delete();

            foreach ($validated['produk'] as $item) {
                LaporanPembelianDetail::create([
                    'laporan_pembelian_id' => $laporanPembelian->id,
                    'produk_id' => $item['produk_id'],
                    'harga' => $item['harga'],
                    'quantity' => $item['quantity'],
                ]);
            }
        });

        return redirect()->route('admin.laporanpembelian.index')
            ->with('success', 'Data Laporan Pembelian berhasil diubah');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $laporanPembelian = LaporanPembelian::find($id);

        if (!$laporanPembelian) {
            return back()->with('error', 'Data tidak ditemukan.');
        }

        $laporanPembelian->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }




    public function konfirmasi($id)
    {
        try {
            // Mencari laporan pembelian beserta detail produk
            $laporan = LaporanPembelian::with('details.produk')->findOrFail($id);

            // Mengecek apakah laporan sudah dikonfirmasi sebelumnya
            if ($laporan->status === 'Dikonfirmasi') {
                return back()->with('message', 'Laporan ini sudah dikonfirmasi sebelumnya');
            }

            // Ubah status laporan menjadi Dikonfirmasi
            $laporan->update(['status' => 'Dikonfirmasi', 'keterangan' => 'Lunas',]);

            // Proses untuk menambah stok produk
            foreach ($laporan->details as $detail) {
                $produk = $detail->produk;

                // Pastikan stok ada atau buat stok jika belum ada
                $stok = $produk->stok()->firstOrCreate([], ['jumlah_stok' => 0]);

                // Menambah jumlah stok berdasarkan quantity dari detail pembelian
                $stok->increment('jumlah_stok', $detail->quantity);

                // Membuat log stok
                StokLog::create([
                    'produk_id' => $produk->id,
                    'tipe' => 'masuk',
                    'jumlah' => $detail->quantity,
                    'sisa_stok' => $stok->jumlah_stok, // <- tambahkan ini
                    'keterangan' => 'Stok masuk dari ' . ($laporan->supplier->nama_supplier ?? 'Supplier Tidak Diketahui'),
                    'tanggal' => now(),
                ]);
            }

            return back()->with('success', 'Berhasil dikonfirmasi dan stok produk berhasil ditambahkan');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal: ' . $e->getMessage());
        }
    }
}
