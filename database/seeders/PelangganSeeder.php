<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PelangganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $pelanggans = [
            [
                'id' => 1,
                'nama_pelanggan' => "undertaker",
                'alamat' => "malang",
                'no_hp' => "08123456789",
            ],
            [
                'id' => 2,
                'nama_pelanggan' => "rey misterio",
                'alamat' => "surabaya",
                'no_hp' => "08123456789",
            ]
            ];
            foreach ($pelanggans as $pelanggan){
                \App\Models\Pelanggan::create($pelanggan);
            }
    }
}
