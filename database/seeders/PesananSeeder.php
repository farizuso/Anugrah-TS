<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use App\Models\Pesanan;
use App\Models\PesananDetail;
use App\Models\Produk;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PesananSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan produk tersedia
        if (Produk::count() === 0) {
            $this->call(ProdukSeeder::class);
        }

        // Pastikan pelanggan tersedia
        if (Pelanggan::count() === 0) {
            $this->call(PelangganSeeder::class);
        }

        $produks = Produk::all();
        $pelanggans = Pelanggan::all();

        foreach (range(1, 5) as $i) {
            $tgl = Carbon::now()->subMonths(rand(0, 5))->subDays(rand(0, 28));
            $pelanggan = $pelanggans->random();

            $pesanan = Pesanan::create([
                'tgl_pesanan' => $tgl,
                'pelanggan_id' => $pelanggan->id,
                'status' => 'Pending',
                'is_lunas' => false,
                'jumlah_terbayar' => 0,
                'keterangan' => 'Belum Lunas',
                'total' => 0,
                'jenis_pesanan' => 'campuran',
            ]);

            $total = 0;

            foreach ($produks->random(rand(2, 4)) as $produk) {
                $qty = rand(1, 5);
                $tipe = rand(0, 1) ? 'sewa' : 'jual';

                $durasi = 0;
                $hargaJual = $produk->harga_jual ?? 0;

                if ($tipe === 'sewa' && $produk->kategori === 'gas') {
                    $durasi = rand(1, 6);
                    $harga = $hargaJual + (100000 * $durasi);
                } else {
                    $tipe = 'jual';
                    $harga = $hargaJual;
                }

                // Simpan detail terlebih dahulu
                $detail = PesananDetail::create([
                    'pesanan_id' => $pesanan->id,
                    'produk_id' => $produk->id,
                    'harga' => $harga,
                    'quantity' => $qty,
                    'tipe_item' => $tipe,
                    'durasi' => $tipe === 'sewa' ? $durasi : 0,
                    'nomor_invoice' => 'INV-' . strtoupper(uniqid()), // contoh format invoice
                ]);

                // Generate dan update nomor_invoice
                $nomorInvoice = 'INV-' . $tgl->format('Ymd') . '-' . str_pad($detail->id, 5, '0', STR_PAD_LEFT);
                $detail->update([
                    'nomor_invoice' => $nomorInvoice,
                ]);

                $total += $harga * $qty;
            }

            // Pembayaran simulasi
            $dibayar = rand(0, $total);

            $pesanan->update([
                'total' => $total,
                'jumlah_terbayar' => $dibayar,
                'is_lunas' => $dibayar >= $total,
                'keterangan' => $dibayar >= $total ? 'Lunas' : 'Belum Lunas',
            ]);
        }
    }
}
