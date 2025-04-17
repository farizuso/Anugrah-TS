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
    /**
     * Run the database seeds.
     */
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

        // Membuat 5 pesanan acak
        foreach (range(1, 5) as $i) {
            $tgl = Carbon::now()->subDays(rand(1, 30))->format('Y-m-d');
            $pelangganTerpilih = $pelanggans->random();
            $keterangan = rand(0, 1) ? 'Lunas' : 'Belum Lunas';

            // Buat pesanan
            $pesanan = Pesanan::create([
                'tgl_pesanan' => $tgl,
                'pelanggan_id' => $pelangganTerpilih->id,
                'keterangan' => $keterangan,
                'total' => 0, // akan diupdate setelah detail
                'status' => 'Pending', // tambahkan default status jika ada kolom ini
            ]);

            $total = 0;

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

            $pesanan->update(['total' => $total]);
        }
    }
}
