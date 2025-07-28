<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pesanan;
use App\Models\PesananDetail;
use App\Models\Pelanggan;
use App\Models\Produk;
use Illuminate\Support\Carbon;

class PesananSeeder extends Seeder
{
    public function run()
    {
        $pelanggans = Pelanggan::all();
        $produks = Produk::all();

        if ($pelanggans->isEmpty() || $produks->isEmpty()) {
            $this->command->error("Seeder gagal: Pelanggan atau Produk belum tersedia.");
            return;
        }

        $lastId = Pesanan::max('id') ?? 0;

        foreach (range(0, 9) as $i) {
            $pelanggan = $pelanggans->random();
            $produkTerpilih = $produks->random(rand(1, 3));

            $tanggalPesanan = Carbon::now()->subMonths($i)->startOfMonth()->addDays(rand(0, 27)); // beda bulan

            $invoiceNumber = 'INV-' . $tanggalPesanan->format('Ymd') . '-' . str_pad($lastId + $i + 1, 5, '0', STR_PAD_LEFT);

            $pesanan = Pesanan::create([
                'nomor_invoice' => $invoiceNumber,
                'tgl_pesanan' => $tanggalPesanan->format('Y-m-d'),
                'pelanggan_id' => $pelanggan->id,
                'total' => 0,
                'jenis_pesanan' => 'campuran',
                'status' => 'Pending',
                'jumlah_terbayar' => 0,
                'is_lunas' => false,
                'keterangan' => 'Pesanan seeder bulan ' . $tanggalPesanan->format('F Y'),
            ]);

            $total = 0;

            foreach ($produkTerpilih as $produk) {
                $harga = $produk->harga_jual ?? rand(50000, 200000);
                $qty = rand(1, 5);
                $tipeItem = ['jual', 'sewa'][rand(0, 1)];
                $durasi = $tipeItem === 'sewa' ? rand(1, 12) : 0;

                PesananDetail::create([
                    'pesanan_id' => $pesanan->id,
                    'produk_id' => $produk->id,
                    'harga' => $harga,
                    'quantity' => $qty,
                    'tipe_item' => $tipeItem,
                    'durasi' => $durasi,
                ]);

                $total += $harga * $qty;
            }

            $jumlahTerbayar = rand(0, 1) ? $total : 0;

            $pesanan->update([
                'total' => $total,
                'jumlah_terbayar' => $jumlahTerbayar,
                'is_lunas' => $jumlahTerbayar >= $total,
            ]);
        }
    }
}
