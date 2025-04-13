<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Rekap;
use Illuminate\Support\Facades\Log;

class RekapController extends Controller
{
    public function index()
    {
        // Mendapatkan data Rekap dengan relasi produk
        $posts = Rekap::with('produk', 'pelanggan')->get();
        return Inertia::render('Admin/Rekap/Index', [
            'posts' => $posts
        ]);
    }

    public function store(Request $request)
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

            // Membuat Rekap baru
            Rekap::create($data);

            // Redirect dengan pesan sukses
            return redirect()->route('admin.rekap.index')->with('success', 'Data Rekap berhasil ditambahkan');
        } catch (\Exception $e) {
            // Log the error if necessary
            Log::error($e->getMessage());

            // Redirect back with error message
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan data: ' . $e->getMessage());
        }
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
            return redirect()->route('admin.rekap.index')->with('success', 'Data Rekap berhasil diubah');
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
        return redirect()->route('admin.rekap.index')->with('success', 'Data Rekap berhasil dihapus');
    }
}
