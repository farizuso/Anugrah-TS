<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RekapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rekaps = [
            [
                'id' => 1,
                'tgl_keluar' => Carbon::now(),
                'tgl_kembali' => Carbon::now(),
                'tgl_masuk_pabrik' => Carbon::now(),
                'keterangan' => "keluar pabrik",
                'produk_id' => 1,
                'pelanggan_id' => 1,
            ],
            [
                'id' => 2,
                'tgl_keluar' => Carbon::now(),
                'tgl_kembali' => Carbon::now(),
                'tgl_masuk_pabrik' => Carbon::now(),
                'keterangan' => "masuk pabrik",
                'produk_id' => 2,
                'pelanggan_id' => 2,
            ]
            ];

            foreach ($rekaps as $rekap){
                \App\Models\Rekap::create($rekap);
            }
    }
}
