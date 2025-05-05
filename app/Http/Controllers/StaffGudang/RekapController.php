<?php

namespace App\Http\Controllers\StaffGudang;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Rekap;
use Illuminate\Support\Facades\Log;

class RekapController extends Controller
{
    public function index()
    {
        // Mendapatkan data Rekap dengan relasi produk
        $posts = Rekap::with('pesanan.pelanggan', 'pesanan.details.produk')->get();

        // Ambil daftar pesanan yang belum direkap
        $pesanans = Pesanan::with('pelanggan', 'produk')
            ->whereDoesntHave('rekaps') // belum direkap
            ->where('status', 'dikirim') // contoh filter
            ->get();


        return Inertia::render('StaffGudang/Rekap/Index', [
            'posts' => $posts,
            'pesanans' => $pesanans,
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Validasi input awal
            $data = $request->validate([
                'pesanan_id' => 'required|integer|exists:pesanans,id',
                'pelanggan_id' => 'required|integer|exists:pelanggans,id',
                'produk_id' => 'required|integer|exists:produks,id',
                'tanggal_keluar' => 'required|date',
                'tanggal_kembali' => 'nullable|date',
                'status' => 'required|in:keluar,kembali',
                'nomor_tabung' => 'required|array|min:1',
                'nomor_tabung.*' => 'required|string|max:255',
            ]);

            // Cek apakah status pesanan sudah dikirim
            $pesanan = Pesanan::findOrFail($request->pesanan_id);
            if ($pesanan->status !== 'Dikirim') {
                return redirect()->back()->with('error', 'Rekap hanya bisa dibuat jika pesanan sudah dikirim.');
            }

            // Proses simpan rekap
            foreach ($request->nomor_tabung as $nomor) {
                Rekap::create([
                    'pesanan_id' => $data['pesanan_id'],
                    'pelanggan_id' => $data['pelanggan_id'],
                    'produk_id' => $data['produk_id'],
                    'nomor_tabung' => $nomor,
                    'tanggal_keluar' => $data['tanggal_keluar'],
                    'tanggal_kembali' => $data['tanggal_kembali'],
                    'status' => $data['status'],
                ]);
            }

            return redirect()->route('staffgudang.rekap.index')->with('success', 'Data Rekap berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan data: ' . $e->getMessage());
        }
    }


    public function updateTanggalKembali(Request $request, Rekap $rekap)
    {
        $request->validate([
            'tanggal_kembali' => 'required|date',
        ]);

        $rekap->update([
            'tanggal_kembali' => $request->tanggal_kembali,
        ]);

        return back()->with('success', 'Tanggal kembali diperbarui.');
    }


    public function update(Request $request, Rekap $rekap)
    {
        try {
            // Validasi input
            $data = $request->validate([
                'tgl_keluar' => 'required|date',
                'tgl_kembali' => 'required|date',
                'tgl_masuk_pabrik' => 'required|date',
                'keterangan' => 'required',
                'produk_id' => 'required|exists:produks,id',
                'pelanggan_id' => 'required|exists:pelanggans,id',
            ]);

            // Update Rekap yang ada
            $rekap->update($data);

            // Redirect dengan pesan sukses
            return redirect()->route('staffgudang.rekap.index')->with('success', 'Data Rekap berhasil diubah');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Jika terjadi kesalahan terkait model tidak ditemukan
            return redirect()->back()->withErrors('Data Rekap tidak ditemukan.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Jika terjadi kesalahan validasi
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            // Untuk kesalahan umum lainnya
            return redirect()->back()->withErrors('Terjadi kesalahan. Silakan coba lagi.');
        }
    }


    public function destroy(Rekap $rekap)
    {
        $rekap->delete();
        return redirect()->route('staffgudang.rekap.index')->with('success', 'Data Rekap berhasil dihapus');
    }
}
