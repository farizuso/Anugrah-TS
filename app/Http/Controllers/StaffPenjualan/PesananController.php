<?php

namespace App\Http\Controllers\StaffPenjualan;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use App\Models\Pesanan;
use App\Models\PesananDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesananController extends Controller
{
    //
    public function index()
    {
        $posts = Pesanan::with(['details.produk', 'pelanggan'])->get();

        // Pastikan tgl_pembelian adalah objek Date
        $posts->transform(function ($post) {
            $post->tgl_pesanan = Carbon::parse($post->tgl_pesanan)->format('Y-m-d');

            return $post;
        });

        return Inertia::render('StaffPenjualan/Pesanan/Index', [
            'posts' => $posts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tgl_pesanan' => 'required|date',
            'pelanggan_id' => 'required|exists:pelanggans,id',
            'produk' => 'required|array|min:1',
            'produk.*.produk_id' => 'required|exists:produks,id',
            'produk.*.quantity' => 'required|numeric|min:1',
            'produk.*.harga' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);


        try {
            // Format tanggal sesuai yang diinginkan
            $tglFix = Carbon::parse($validated['tgl_pesanan'])->format('Y-m-d');
        } catch (\Exception $e) {
            return back()->withErrors(['tgl_pesanan' => 'Format tanggal tidak valid.']);
        }

        // Menjalankan transaksi untuk memastikan atomisitas
        DB::transaction(function () use ($validated, $tglFix) {
            // Ambil supplier berdasarkan supplier_id
            $pelangganId = $validated['pelanggan_id'];
            $pelanggan = Pelanggan::find($pelangganId);
            $namaPelanggan = $pelanggan?->nama_pelanggan;

            // Membuat laporan pembelian
            $pesanan = Pesanan::create([
                'tgl_pesanan' => $tglFix,
                'pelanggan_id' => $pelangganId,
                'keterangan' => $validated['keterangan'] ?? null,
                'total' => collect($validated['produk'])->sum(fn($item) => $item['harga'] * $item['quantity']),
            ]);


            // Menyimpan detail produk
            foreach ($validated['produk'] as $item) {
                PesananDetail::create([
                    'pesanan_id' => $pesanan->id,
                    'produk_id' => $item['produk_id'],
                    'harga' => $item['harga'],
                    'quantity' => $item['quantity'],
                ]);
            }
        });

        // Redirect ke halaman laporan pembelian setelah berhasil menyimpan data
        return redirect()->route('staffpenjualan.pesanan.index')
            ->with('success', 'Data Pesanan berhasil disimpan');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'tgl_pesanan' => 'required|date',
            'pelanggan_id' => 'required|exists:pelanggans,id',
            'produk' => 'required|array|min:1',
            'produk.*.produk_id' => 'required|exists:produks,id',
            'produk.*.quantity' => 'required|numeric|min:1',
            'produk.*.harga' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            $tglFix = Carbon::parse($validated['tgl_pesanan'])->format('Y-m-d');
        } catch (\Exception $e) {
            return back()->withErrors(['tgl_pesanan' => 'Format tanggal tidak valid.']);
        }

        DB::transaction(function () use ($validated, $tglFix, $id) {
            // Temukan pesanan
            $pesanan = Pesanan::findOrFail($id);

            // Update data utama pesanan
            $pesanan->update([
                'tgl_pesanan' => $tglFix,
                'pelanggan_id' => $validated['pelanggan_id'],
                'keterangan' => $validated['keterangan'] ?? null,
                'total' => collect($validated['produk'])->sum(fn($item) => $item['harga'] * $item['quantity']),
            ]);

            // Hapus semua detail sebelumnya
            $pesanan->details()->delete();

            // Tambahkan detail baru
            foreach ($validated['produk'] as $item) {
                PesananDetail::create([
                    'pesanan_id' => $pesanan->id,
                    'produk_id' => $item['produk_id'],
                    'harga' => $item['harga'],
                    'quantity' => $item['quantity'],
                ]);
            }
        });

        return redirect()->route('staffpenjualan.pesanan.index')
            ->with('success', 'Data Pesanan berhasil diperbarui');
    }

    public function destroy($id)
    {
        $pesanan = Pesanan::find($id);

        if (!$pesanan) {
            return back()->with('error', 'Data tidak ditemukan.');
        }

        $pesanan->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
