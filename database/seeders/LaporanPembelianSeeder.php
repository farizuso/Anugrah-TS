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

        // Ambil produk dan supplier
        $produks = Produk::all();
        $suppliers = Supplier::all();

        // Daftar harga tetap berdasarkan nama_produk
        $hargaTetap = [
            'oxygen' => 35000,
            'karbon dioksida' => 150000,
            'asitilen' => 390000,
            'argon' => 220000,
            'nitrogen' => 95000,
            'LPG' => 500000,
            'regulator' => 150000,
            'non-breathing mask' => 25000,
        ];

        // Buat 5 laporan pembelian acak
        foreach (range(1, 5) as $i) {
            $tgl = Carbon::now()
                ->subDays(rand(1, 30))
                ->setTime(rand(8, 17), rand(0, 59)) // random jam
                ->format('Y-m-d H:i:s');

            $supplier = $suppliers->random();
            $keterangan = rand(0, 1) ? 'Lunas' : 'Belum Lunas';
            $metodePembayaran = rand(0, 1) ? 'Tunai' : 'Transfer';

            $pembelian = LaporanPembelian::create([
                'tgl_pembelian' => $tgl,
                'supplier_id' => $supplier->id,
                'keterangan' => $keterangan,
                'metode_pembayaran' => $metodePembayaran,
                'total' => 0, // sementara
                'ppn' => 0,
                'grand_total' => 0,
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

            $ppn = $total * 0.11;
            $grandTotal = $total + $ppn;

            $pembelian->update([
                'total' => $total,
                'ppn' => $ppn,
                'grand_total' => $grandTotal,
            ]);
        }
    }
}
