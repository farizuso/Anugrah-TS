<?php

namespace App\Http\Controllers\StaffGudang;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Models\Rekap;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\DB;


class RekapController extends Controller
{


    public function index()
    {
        $rekaps = Rekap::with('pesanan.pelanggan')->get(); // penting: eager load relasi

        return Inertia::render('StaffGudang/Rekap/Index', [
            'rekaps' => $rekaps,
        ]);
    }



    public function store(Request $request)
    {
        $request->validate([
            'pesanan_id' => 'required|exists:pesanans,id',
            'status' => 'required|in:keluar,kembali',
            'tabung_per_produk' => 'required|array|min:1',
            'tabung_per_produk.*.produk_id' => 'required|exists:produks,id',
            'tabung_per_produk.*.tabung' => 'required|array|min:1',
            'tabung_per_produk.*.tabung.*' => 'required|string|min:1',
        ]);

        DB::beginTransaction();

        try {
            $pesananId = $request->pesanan_id;
            $status = $request->status;

            $pesanan = Pesanan::findOrFail($pesananId);
            $pelangganId = $pesanan->pelanggan_id;

            foreach ($request->tabung_per_produk as $item) {
                $produkId = $item['produk_id'];
                $tabungList = $item['tabung'];

                foreach ($tabungList as $nomorTabung) {
                    Rekap::create([
                        'pesanan_id' => $pesananId,
                        'pelanggan_id' => $pelangganId,
                        'produk_id' => $produkId,
                        'tanggal_keluar' => $status === 'keluar' ? now() : null,
                        'tanggal_kembali' => $status === 'kembali' ? now() : null,
                        'nomor_tabung' => $nomorTabung,
                        'status' => $status,
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Data rekap berhasil disimpan.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }



    public function destroy(Rekap $rekap)
    {
        $rekap->delete();
        return redirect()->back()->with('success', 'Rekap berhasil dihapus.');
    }

    public function update(Request $request, Rekap $rekap)
    {
        $request->validate([
            'status' => 'required|in:keluar,kembali',
        ]);

        $rekap->update([
            'status' => $request->status,
            'tanggal_kembali' => $request->status === 'kembali' ? now() : null,
        ]);

        return redirect()->back()->with('success', 'Rekap berhasil diperbarui.');
    }
}
