<?php

namespace App\Http\Controllers\StaffGudang;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Models\Rekap;

use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RekapController extends Controller
{


    public function index()
    {
        $rekaps = Rekap::with(['pesanan', 'pesanan.pelanggan', 'pesanan.details.produk'])->get();

        // Ambil hanya pesanan yang belum direkap
        $pesanans = Pesanan::with(['pelanggan', 'details.produk'])
            ->whereNotIn('id', function ($query) {
                $query->select('pesanan_id')->from('rekaps');
            })
            ->get();

        return Inertia::render('StaffGudang/Rekap/Index', [
            'rekaps' => $rekaps,
            'pesanans' => $pesanans,
        ]);
    }







    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'pesanan_id' => 'required|exists:pesanans,id',
                'status' => 'required|in:keluar,kembali',
                'tabung_per_produk' => 'required|array|min:1',
                'tabung_per_produk.*.produk_id' => 'required|exists:produks,id',
                'tabung_per_produk.*.tabung' => 'required|array|min:1',
                'tabung_per_produk.*.tabung.*' => 'required|string|min:1',
            ]);

            DB::beginTransaction();

            $pesanan = Pesanan::findOrFail($validated['pesanan_id']);
            $pelangganId = $pesanan->pelanggan_id;
            $status = $validated['status'];

            foreach ($validated['tabung_per_produk'] as $item) {
                foreach ($item['tabung'] as $nomorTabung) {
                    Rekap::create([
                        'pesanan_id' => $validated['pesanan_id'],
                        'pelanggan_id' => $pelangganId,
                        'produk_id' => $item['produk_id'],
                        'tanggal_keluar' => $status === 'keluar' ? now() : null,
                        'tanggal_kembali' => $status === 'kembali' ? now() : null,
                        'nomor_tabung' => $nomorTabung,
                        'status' => $status,
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Data rekap berhasil disimpan.');
        } catch (ValidationException $e) {
            // Ambil hanya pesan error pertama (atau sesuaikan)
            $firstError = collect($e->errors())->flatten()->first();
            return redirect()->back()->with('error', $firstError ?? 'Data tidak valid.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage());
        }
    }



    public function destroy(Rekap $rekap)
    {
        $rekap->delete();
        return redirect()->back()->with('success', 'Rekap berhasil dihapus.');
    }

    public function konfirmasiKembali($id)
    {
        $rekap = Rekap::findOrFail($id);

        $rekap->update([
            'status' => 'kembali',
            'tanggal_kembali' => now(),
        ]);

        return redirect()->back()->with('message', 'Tabung dikonfirmasi kembali.');
    }





    public function update(Request $request, Rekap $rekap)
    {
        $validated = $request->validate([
            'nomor_tabung' => 'required|string|max:255',
            'status' => 'required|in:keluar,kembali',
            'tanggal_kembali' => 'nullable|date',
        ]);

        $rekap->update($validated);

        return redirect()->back()->with('success', 'Data rekap berhasil diperbarui.');
    }
}
