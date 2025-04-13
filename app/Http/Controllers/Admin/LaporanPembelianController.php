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
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class LaporanPembelianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $laporan = LaporanPembelian::with('details.produk')->get();

        return Inertia::render('Admin/LaporanPembelian/Index', [
            'posts' => $laporan,
            'produks' => Produk::all(), // supaya tetap bisa dipakai di form select
        ]);
    }
    public function export()
    {
        return Excel::download(new LaporanPembelianExport, 'laporan_pembelian.xlsx');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tgl_pembelian' => 'required|date', // bisa juga 'date', tapi kita parse manual
            'nama_supplier' => 'required|string',
            'produk' => 'required|array|min:1',
            'produk.*.produk_id' => 'required|exists:produks,id',
            'produk.*.harga' => 'required|numeric|min:0',
            'produk.*.quantity' => 'required|numeric|min:1',
            'keterangan' => 'nullable|string',
        ]);

        // 🔐 Pastikan format tanggal aman (YYYY-MM-DD)
        try {
            $tglFix = \Carbon\Carbon::parse($validated['tgl_pembelian'])->format('Y-m-d');
        } catch (\Exception $e) {
            return back()->withErrors(['tgl_pembelian' => 'Format tanggal tidak valid.']);
        }

        DB::transaction(function () use ($validated, $tglFix) {
            $pembelian = LaporanPembelian::create([
                'tgl_pembelian' => $tglFix,
                'nama_supplier' => $validated['nama_supplier'],
                'keterangan' => $validated['keterangan'] ?? null,
                'total' => collect($validated['produk'])->sum(function ($item) {
                    return $item['harga'] * $item['quantity'];
                }),
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
    }




    /**
     * Display the specified resource.
     */
    public function show(LaporanPembelian $laporanPembelian)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LaporanPembelian $laporanPembelian)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'tgl_pembelian' => 'required|date',
            'nama_supplier' => 'required|string',
            'produk' => 'required|array|min:1',
            'produk.*.produk_id' => 'required|exists:produks,id',
            'produk.*.harga' => 'required|numeric|min:0',
            'produk.*.quantity' => 'required|numeric|min:1',
            'keterangan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $id) {
            // ✅ Ambil ulang model berdasarkan ID
            $laporanPembelian = LaporanPembelian::findOrFail($id);

            // Hitung total baru
            $totalBaru = collect($validated['produk'])->sum(function ($item) {
                return $item['harga'] * $item['quantity'];
            });

            // Update laporan
            $laporanPembelian->update([
                'tgl_pembelian' => $validated['tgl_pembelian'],
                'nama_supplier' => $validated['nama_supplier'],
                'keterangan' => $validated['keterangan'] ?? null,
                'total' => $totalBaru,
            ]);

            // Hapus semua detail lama
            $laporanPembelian->details()->delete();

            // Tambahkan ulang detail
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
}