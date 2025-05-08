<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LaporanPembelian;
use App\Models\LaporanPembelianDetail;
use App\Models\Produk;
use App\Models\Supplier;
use Illuminate\Support\Carbon;

class LaporanPembelianSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan supplier tersedia
        if (Supplier::count() === 0) {
            $this->call(SupplierSeeder::class);
        }

        // Ambil produk yang sudah ada dari ProdukSeeder
        $produks = Produk::all();
        $suppliers = Supplier::all();

        // Daftar harga tetap berdasarkan nama_produk dari ProdukSeeder
        $hargaTetap = [
            'oxygen' => 100000,
            'karbon dioksida' => 200000,
            'asitilen' => 500000,
            'argon' => 350000,
            'nitrogen' => 170000,
            'LPG' => 850000,
            'regulator' => 150000,
            'non-breathing mask' => 25000,
        ];

        // Buat 5 laporan pembelian acak
        foreach (range(1, 5) as $i) {
            $tgl = Carbon::now()->subDays(rand(1, 30))->format('Y-m-d');
            $supplier = $suppliers->random();
            $keterangan = rand(0, 1) ? 'Lunas' : 'Belum Lunas';

            $pembelian = LaporanPembelian::create([
                'tgl_pembelian' => $tgl,
                'supplier_id' => $supplier->id,
                'keterangan' => $keterangan,
                'total' => 0,
            ]);

            $total = 0;

            foreach ($produks->random(rand(2, 4)) as $produk) {
                $nama = $produk->nama_produk;
                $harga = $hargaTetap[$nama] ?? $produk->harga_jual;
                $qty = rand(1, 10);

                LaporanPembelianDetail::create([
                    'laporan_pembelian_id' => $pembelian->id,
                    'produk_id' => $produk->id,
                    'harga' => $harga,
                    'quantity' => $qty,
                ]);

                $total += $harga * $qty;
            }

            $pembelian->update(['total' => $total]);
        }
    }
}
