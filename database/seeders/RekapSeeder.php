<?php

namespace Database\Seeders;

use App\Models\Rekap;
use App\Models\Pesanan;
use App\Models\Pelanggan;
use App\Models\Produk;
use Illuminate\Database\Seeder;

class RekapSeeder extends Seeder
{
    public function run()
    {
        $pesanans = Pesanan::with('pelanggan', 'details.produk')->get();

        foreach ($pesanans as $pesanan) {
            foreach ($pesanan->details as $detail) {
                for ($i = 0; $i < $detail->quantity; $i++) {
                    Rekap::create([
                        'pesanan_id' => $pesanan->id,
                        'pelanggan_id' => $pesanan->pelanggan->id ?? null,
                        'produk_id' => $detail->produk->id ?? null,
                        'nomor_tabung' => 'TAB-' . strtoupper(uniqid()),
                        'status' => 'keluar',
                        'tanggal_keluar' => now()->subDays(rand(1, 10)),
                        'tanggal_kembali' => null,
                    ]);
                }
            }
        }
    }
}
