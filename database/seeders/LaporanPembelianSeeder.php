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
        // Tambah produk kalau belum ada
        if (Produk::count() === 0) {
            Produk::insert([
                ['nama_produk' => 'Oksigen'],
                ['nama_produk' => 'Nitrogen'],
                ['nama_produk' => 'Argon'],
                ['nama_produk' => 'Asetilena'],
                ['nama_produk' => 'Karbon Dioksida'],
            ]);
        }

        // Pastikan supplier dari seeder sudah ada
        if (Supplier::count() === 0) {
            $this->call(SupplierSeeder::class);
        }

        // Ambil semua produk dan supplier yang ada
        $produks = Produk::all();
        $suppliers = Supplier::all();

        // Membuat 5 laporan pembelian secara acak
        foreach (range(1, 5) as $i) {
            // Pilih tanggal acak dalam 30 hari terakhir
            $tgl = Carbon::now()->subDays(rand(1, 30))->format('Y-m-d');
            $supplier = $suppliers->random(); // Pilih supplier acak
            $keterangan = rand(0, 1) ? 'Lunas' : 'Belum Lunas'; // Pilih status pembayaran acak

            // Buat laporan pembelian
            $pembelian = LaporanPembelian::create([
                'tgl_pembelian' => $tgl,
                'supplier_id' => $supplier->id,
                'keterangan' => $keterangan,
                'total' => 0, // total akan dihitung setelah detail produk
            ]);

            $total = 0; // Inisialisasi total pembelian

            // Pilih 2 hingga 4 produk secara acak untuk setiap laporan pembelian
            foreach ($produks->random(rand(2, 4)) as $produk) {
                $harga = rand(10000, 50000); // Harga acak antara 10.000 hingga 50.000
                $qty = rand(1, 10); // Quantity acak antara 1 hingga 10

                // Buat detail laporan pembelian
                LaporanPembelianDetail::create([
                    'laporan_pembelian_id' => $pembelian->id,
                    'produk_id' => $produk->id,
                    'harga' => $harga,
                    'quantity' => $qty,
                ]);

                // Update total pembelian
                $total += $harga * $qty;
            }

            // Update total laporan pembelian setelah semua detail produk dihitung
            $pembelian->update(['total' => $total]);
        }
    }
}