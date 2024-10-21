<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StokSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $stoks = [
            [
                'id' => 1,
                'lokasi_penyimpanan' => "pabrik",
                'jumlah_stok' => 10,
                'minimum_stok' => 5,
                'tgl_update_stok' => Carbon::now(),
                'produk_id' => 1,
            ],
            [
                'id' => 2,
                'lokasi_penyimpanan' => "pabrik",
                'jumlah_stok' => 10,
                'minimum_stok' => 5,
                'tgl_update_stok' => Carbon::now(),
                'produk_id' => 2,
            ]
            ];

            foreach ($stoks as $stok){
                \App\Models\Stok::create($stok);
            }
    }
}
