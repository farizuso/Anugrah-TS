<?php

namespace App\Http\Controllers\StaffPenjualan;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use App\Models\Pesanan;
use App\Models\PesananDetail;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\PembayaranPesanan;
use App\Models\Rekap;
use App\Models\Stok;
use App\Models\StokLog;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

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
        $validator = Validator::make($request->all(), [
            'tgl_pesanan' => 'required|date',
            'pelanggan_id' => 'required|exists:pelanggans,id',
            'produk' => 'required|array|min:1',
            'produk.*.produk_id' => 'required|exists:produks,id',
            'produk.*.harga' => 'required|numeric|min:0',
            'produk.*.quantity' => 'required|integer|min:1',
            'produk.*.tipe_item' => 'required|in:jual,sewa',
            'produk.*.durasi' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput()
                ->with('error', 'Validasi gagal. Silakan periksa kembali form Anda.');
        }

        $produkList = $request->produk;

        foreach ($produkList as $item) {
            $stok = Stok::where('produk_id', $item['produk_id'])->first();

            // Tambahan validasi jika stok tidak ada
            if (!$stok) {
                return redirect()->back()
                    ->with('error', "Stok untuk produk ID {$item['produk_id']} belum tersedia.")
                    ->withInput();
            }

            if ($stok->jumlah_stok < $item['quantity']) {
                return redirect()->back()
                    ->with('error', "Stok untuk produk ID {$item['produk_id']} tidak mencukupi.")
                    ->withInput();
            }
        }


        DB::beginTransaction();

        try {
            $total = 0;

            foreach ($produkList as $item) {
                $jumlah = (int) $item['quantity'];
                $harga = (int) $item['harga'];
                $subtotal = $jumlah * $harga;
                $total += $subtotal;
            }

            $pesanan = Pesanan::create([
                'tgl_pesanan' => $request->tgl_pesanan,
                'pelanggan_id' => $request->pelanggan_id,
                'total' => $total,
                'jenis_pesanan' => 'campuran',
                'status' => 'Pending',
                'jumlah_terbayar' => 0,
                'is_lunas' => false,
                'keterangan' => 'Belum Lunas',
            ]);

            $pelanggan = Pelanggan::find($request->pelanggan_id);
            $lastId = \App\Models\PesananDetail::max('id') + 1;
            $nomorInvoice = 'INV-' . now()->format('Ymd') . '-' . str_pad($lastId, 5, '0', STR_PAD_LEFT);

            foreach ($produkList as $item) {
                PesananDetail::create([
                    'pesanan_id' => $pesanan->id,
                    'nomor_invoice' => $nomorInvoice,
                    'produk_id' => $item['produk_id'],
                    'harga' => $item['harga'],
                    'quantity' => $item['quantity'],
                    'tipe_item' => $item['tipe_item'],
                    'durasi' => $item['tipe_item'] === 'sewa' ? $item['durasi'] : 0,
                ]);

                $stok = Stok::where('produk_id', $item['produk_id'])->first();
                if ($stok) {
                    $stok->jumlah_stok -= $item['quantity'];
                    $stok->save();

                    try {
                        StokLog::create([
                            'produk_id' => $item['produk_id'],
                            'tipe' => 'keluar',
                            'jumlah' => $item['quantity'],
                            'sisa_stok' => $stok->jumlah_stok,
                            'keterangan' => 'Stok keluar  pesanan ' . $item['tipe_item'] . ' dari ' . $pelanggan->nama_pelanggan,
                            'tanggal' => now(),
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Gagal membuat stok log: ' . $e->getMessage());
                    }
                }
            }

            DB::commit();

            return redirect()->route('staffpenjualan.pesanan.index')
                ->with('success', 'Pesanan berhasil disimpan.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Gagal simpan pesanan: " . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat membuat pesanan.')
                ->withInput();
        }
    }




    public function detail_pesanan($id)
    {
        $pesanan = Pesanan::with(['pelanggan', 'details.produk', 'riwayat_pembayaran'])->findOrFail($id);

        // 👇 debug cek apakah `jenis` masuk
        foreach ($pesanan->details as $detail) {
            Log::info("Produk: {$detail->produk->nama_produk}, Jenis: {$detail->produk->jenis}");
        }

        return Inertia::render('StaffPenjualan/Pesanan/Detail', [
            'pesanan' => $pesanan,
        ]);
    }


    public function getdetail_pesananAdmin($id)
    {
        $pesanan = Pesanan::with(['pelanggan', 'details.produk', 'riwayat_pembayaran'])->findOrFail($id);

        // 👇 debug cek apakah `jenis` masuk
        foreach ($pesanan->details as $detail) {
            Log::info("Produk: {$detail->produk->nama_produk}, Jenis: {$detail->produk->jenis}");
        }

        return Inertia::render('Admin/LaporanPenjualan/Detail', [
            'pesanan' => $pesanan,
        ]);
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
            'produk.*.tipe_item' => 'required|in:jual,sewa',
            'produk.*.durasi' => 'nullable|numeric|min:0',
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

            // Hitung total dari semua item
            $total = collect($validated['produk'])->sum(function ($item) {
                return $item['harga'] * $item['quantity'];
            });

            // Update data utama pesanan
            $pesanan->update([
                'tgl_pesanan' => $tglFix,
                'pelanggan_id' => $validated['pelanggan_id'],
                'keterangan' => $validated['keterangan'] ?? null,
                'total' => $total,
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
                    'tipe_item' => $item['tipe_item'],
                    'durasi' => $item['tipe_item'] === 'sewa' ? $item['durasi'] : 0,
                ]);
            }
        });

        return redirect()->route('staffpenjualan.pesanan.index')
            ->with('success', 'Data Pesanan berhasil diperbarui');
    }


    public function invoice($id)
    {
        $pesanan = Pesanan::with(['pelanggan', 'details.produk'])->findOrFail($id);
        return Inertia::render('Pesanan/Invoice', [
            'pesanan' => $pesanan,
        ]);
    }


    public function invoicePdf($id)
    {
        $pesanan = Pesanan::with(['pelanggan', 'details.produk'])->findOrFail($id);

        $pdf = Pdf::loadView('pdf.invoice', ['pesanan' => $pesanan]);
        return $pdf->stream("invoice-{$pesanan->id}.pdf");
    }

    public function tandaTerimaKosongPdf($id)
    {
        $pesanan = Pesanan::with(['pelanggan', 'details.produk'])->findOrFail($id);

        return Pdf::loadView('pdf.tanda_terima_kosong', compact('pesanan'))
            ->stream('tanda-terima-botol-kosong.pdf');
    }

    public function konfirmasiPembayaran(Request $request, $id)
    {
        $request->validate([
            'jumlah_terbayar' => 'required|integer|min:1',
            'bukti_transfer' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $pesanan = Pesanan::findOrFail($id);

        $jumlah = $request->jumlah_terbayar;
        $totalBaru = $pesanan->jumlah_terbayar + $jumlah;
        $isLunas = $totalBaru >= $pesanan->total;

        // Upload bukti (optional)
        $bukti = null;
        if ($request->hasFile('bukti_transfer')) {
            $bukti = $request->file('bukti_transfer')->store('bukti_transfer', 'public');
        }

        // ✅ Tambahkan histori pembayaran
        PembayaranPesanan::create([
            'pesanan_id' => $pesanan->id,
            'jumlah_bayar' => $jumlah,
            'bukti_transfer' => $bukti,
        ]);

        $pesanan->update([
            'jumlah_terbayar' => $totalBaru,
            'is_lunas' => $isLunas,
            'keterangan' => $isLunas ? 'Lunas' : ($totalBaru > 0 ? 'Cicilan' : 'Belum Lunas'),
        ]);

        return back()->with('success', 'Pembayaran berhasil dikonfirmasi.');
    }

    public function updateMetodePembayaran(Request $request, $id)
    {
        $request->validate([
            'metode_pembayaran' => 'required|in:tunai,transfer,cicilan',
        ]);

        $pesanan = Pesanan::findOrFail($id);
        $pesanan->metode_pembayaran = $request->metode_pembayaran;
        $pesanan->save();

        return back()->with('success', 'Metode pembayaran diperbarui.');
    }

    public function konfirmasiKirim($id)
    {
        $pesanan = Pesanan::findOrFail($id);
        $pesanan->update(['status' => 'Dikirim']);

        // Otomatis isi tanggal_keluar di tabel Rekap (jika sudah pernah dibuat manual sebelumnya)
        Rekap::where('pesanan_id', $pesanan->id)
            ->update(['tanggal_keluar' => now()]);

        return back()->with('success', 'Pesanan telah dikonfirmasi sebagai Dikirim.');
    }


    public function tandaiSelesai($id)
    {
        $pesanan = Pesanan::findOrFail($id);

        // Ubah status saja
        $pesanan->update(['status' => 'Selesai']);

        return back()->with('success', 'Pesanan telah ditandai sebagai Selesai.');
    }



    public function LaporanPenjualan(Request $request)
    {
        $query = Pesanan::with(['pelanggan', 'details']);

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('tgl_pesanan', [$request->start_date, $request->end_date]);
        }

        $penjualan = $query->orderBy('tgl_pesanan', 'desc')->get();

        return Inertia::render('StaffPenjualan/LaporanPenjualan/Index', [
            'penjualan' => $penjualan,
        ]);
    }

    public function getLaporanPenjualanAdmin(Request $request)
    {
        $query = Pesanan::with(['pelanggan', 'details']);

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('tgl_pesanan', [$request->start_date, $request->end_date]);
        }

        $penjualan = $query->orderBy('tgl_pesanan', 'desc')->get();

        return Inertia::render('Admin/LaporanPenjualan/Index', [
            'penjualan' => $penjualan,
        ]);
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
