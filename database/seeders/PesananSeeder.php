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
        // Tambahkan produk jika belum ada
        if (Produk::count() === 0) {
            Produk::insert([
                ['nama_produk' => 'Oksigen'],
                ['nama_produk' => 'Nitrogen'],
                ['nama_produk' => 'Argon'],
                ['nama_produk' => 'Asetilena'],
                ['nama_produk' => 'Karbon Dioksida'],
            ]);
        }

        // Pastikan pelanggan tersedia
        if (Pelanggan::count() === 0) {
            $this->call(PelangganSeeder::class);
        }

        $produks = Produk::all();
        $pelanggans = Pelanggan::all();
        $metodes = ['Tunai', 'Transfer', 'Cicilan'];

        foreach (range(1, 5) as $i) {
            $tgl = Carbon::now()->subDays(rand(1, 30))->format('Y-m-d');
            $pelangganTerpilih = $pelanggans->random();
            $keterangan = rand(0, 1) ? 'Lunas' : 'Belum Lunas';
            $metode = $metodes[array_rand($metodes)];
            $total = 0;

            // Dummy nilai default
            $isLunas = false;
            $jumlahBayar = 0;

            // Buat dulu kosong, total dihitung nanti
            $pesanan = Pesanan::create([
                'tgl_pesanan' => $tgl,
                'pelanggan_id' => $pelangganTerpilih->id,
                'keterangan' => $keterangan,
                'metode_pembayaran' => $metode,
                'total' => 0,
                'status' => 'Pending',
                'is_lunas' => false,
                'jumlah_terbayar' => 0,
            ]);

            foreach ($produks->random(rand(2, 4)) as $produk) {
                $harga = rand(10000, 50000);
                $qty = rand(1, 10);

                PesananDetail::create([
                    'pesanan_id' => $pesanan->id,
                    'produk_id' => $produk->id,
                    'harga' => $harga,
                    'quantity' => $qty,
                ]);

                $total += $harga * $qty;
            }

            // Simulasikan status pembayaran
            if ($metode === 'Tunai') {
                $isLunas = true;
                $jumlahBayar = $total;
            } elseif ($metode === 'Transfer') {
                $jumlahBayar = $total;
                // anggap masih perlu verifikasi → is_lunas tetap false
            } elseif ($metode === 'Cicilan') {
                $jumlahBayar = floor($total / 2);
                $isLunas = $jumlahBayar >= $total;
            }

            $pesanan->update([
                'total' => $total,
                'jumlah_terbayar' => $jumlahBayar,
                'is_lunas' => $isLunas,
            ]);
        }
    }
}
