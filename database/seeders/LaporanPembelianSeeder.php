<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LaporanPembelian;
use App\Models\LaporanPembelianDetail;
use App\Models\Produk;
use Illuminate\Support\Carbon;

class LaporanPembelianSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tambahkan Produk jika belum ada
        if (Produk::count() === 0) {
            Produk::insert([
                ['nama_produk' => 'Oksigen'],
                ['nama_produk' => 'Nitrogen'],
                ['nama_produk' => 'Argon'],
                ['nama_produk' => 'Asetilena'],
                ['nama_produk' => 'Karbon Dioksida'],
            ]);
        }

        $produks = Produk::all();

        // 2. Tambahkan beberapa laporan pembelian
        foreach (range(1, 5) as $i) {
            $tgl = Carbon::now()->subDays(rand(1, 30))->format('Y-m-d');
            $supplier = fake()->company();
            $keterangan = rand(0, 1) ? 'Lunas' : 'Belum Lunas';

            $pembelian = LaporanPembelian::create([
                'tgl_pembelian' => $tgl,
                'nama_supplier' => $supplier,
                'keterangan' => $keterangan,
                'total' => 0, // akan di-update setelah hitung
            ]);

            $total = 0;

            // 3. Tambahkan detail produk random
            foreach ($produks->random(rand(2, 4)) as $produk) {
                $harga = rand(10000, 50000);
                $qty = rand(1, 10);

                LaporanPembelianDetail::create([
                    'laporan_pembelian_id' => $pembelian->id,
                    'produk_id' => $produk->id,
                    'harga' => $harga,
                    'quantity' => $qty,
                ]);

                $total += $harga * $qty;
            }

            // 4. Update total pembelian
            $pembelian->update(['total' => $total]);
        }
    }
}