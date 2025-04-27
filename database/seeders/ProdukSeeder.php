<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define a list of industrial gases
        $gases = [
            [
                'id' => 1,
                'nama_produk' => "nitrogen",
                'simbol' => "N",
                'kategori' => "gas",
                'harga_jual' => 170000,
            ],
            [
                'id' => 2,
                'nama_produk' => "oxygen",
                'simbol' => "O",
                'kategori' => "gas",
                'harga_jual' => 100000,
            ],
            [
                'id' => 3,
                'nama_produk' => "argon",
                'simbol' => "Ar",
                'kategori' => "gas",
                'harga_jual' => 350000,
            ],
            [
                'id' => 4,
                'nama_produk' => "asitilen",
                'simbol' => "C2H2",
                'kategori' => "gas",
                'harga_jual' => 500000,
            ],
            [
                'id' => 5,
                'nama_produk' => "karbon dioksida",
                'simbol' => "CO2",
                'kategori' => "gas",
                'harga_jual' => 200000,
            ],
            [
                'id' => 6,
                'nama_produk' => "LPG",
                'simbol' => "LPG",
                'kategori' => "gas",
                'harga_jual' => 850000,
            ],
            [
                'id' => 7,
                'nama_produk' => "regulator",
                'simbol' => "-",
                'kategori' => "aksesoris",
                'harga_jual' => 150000,
            ],
            [
                'id' => 8,
                'nama_produk' => "non-breathing mask",
                'simbol' => "-",
                'kategori' => "aksesoris",
                'harga_jual' => 25000,
            ],
        ];
        foreach ($gases as $gas) {
            \App\Models\Produk::create($gas);
        }
    }
}
