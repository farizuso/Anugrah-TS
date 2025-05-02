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
        // Pastikan ada produk dan pelanggan
        if (Produk::count() === 0) {
            Produk::insert([
                ['nama_produk' => 'Oksigen'],
                ['nama_produk' => 'Nitrogen'],
                ['nama_produk' => 'Argon'],
                ['nama_produk' => 'Asetilena'],
                ['nama_produk' => 'Karbon Dioksida'],
            ]);
        }

        if (Pelanggan::count() === 0) {
            $this->call(PelangganSeeder::class);
        }

        $produks = Produk::all();
        $pelanggans = Pelanggan::all();

        foreach (range(1, 5) as $i) {
            $tgl = Carbon::now()->subMonths(rand(0, 5))->subDays(rand(0, 28));


            $pelanggan = $pelanggans->random();

            // Buat pesanan tanpa metode pembayaran
            $pesanan = Pesanan::create([
                'tgl_pesanan' => $tgl,
                'pelanggan_id' => $pelanggan->id,
                'status' => 'Pending',
                'is_lunas' => false,
                'jumlah_terbayar' => 0,
                'keterangan' => 'Belum Lunas',
                'total' => 0,
            ]);

            $total = 0;

            // Tambahkan detail produk
            foreach ($produks->random(rand(2, 4)) as $produk) {
                $harga = rand(10000, 50000);
                $qty = rand(1, 5);

                PesananDetail::create([
                    'pesanan_id' => $pesanan->id,
                    'produk_id' => $produk->id,
                    'harga' => $harga,
                    'quantity' => $qty,
                ]);

                $total += $harga * $qty;
            }

            // Simulasikan sebagian ada yang sudah dibayar
            $dibayar = rand(0, $total); // bisa 0, cicilan, atau full

            $pesanan->update([
                'total' => $total,
                'jumlah_terbayar' => $dibayar,
                'is_lunas' => $dibayar >= $total,
                'keterangan' => $dibayar >= $total
                    ? 'Lunas'
                    : ($dibayar > 0 ? 'Cicilan' : 'Belum Lunas'),
            ]);
        }
    }
}
