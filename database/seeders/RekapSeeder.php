<?php

namespace Database\Seeders;

use App\Models\Pesanan;
use App\Models\Rekap;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RekapSeeder extends Seeder
{
    public function run(): void
    {
        $pesanans = Pesanan::with(['pelanggan', 'details'])->get();
        $counter = 1;

        foreach ($pesanans as $pesanan) {
            foreach ($pesanan->details as $detail) {
                // Simulasi tiap detail punya 1-2 tabung keluar
                foreach (range(1, rand(1, 2)) as $_) {
                    Rekap::create([
                        'pesanan_id' => $pesanan->id,
                        'pelanggan_id' => $pesanan->pelanggan_id, // ⬅️ ambil dari pesanan
                        'produk_id' => $detail->produk_id,
                        'nomor_tabung' => 'TBG-' . str_pad($counter++, 3, '0', STR_PAD_LEFT),
                        'tanggal_keluar' => $pesanan->tgl_pesanan,
                        'tanggal_kembali' => null, // bisa dibuat random juga kalau mau
                        'status' => 'keluar',
                    ]);
                }
            }
        }
    }
}
