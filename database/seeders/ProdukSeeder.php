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
            ["nama_produk" => "Oksigen", "simbol" => "O₂"],
            ["nama_produk" => "Argon", "simbol" => "Ar"],
            ["nama_produk" => "Nitrogen", "simbol" => "N₂"],
            ["nama_produk" => "Karbon Dioksida", "simbol" => "CO₂"],
            ["nama_produk" => "Asetilena", "simbol" => "C₂H₂"],
        ];

        // Generate 50 product entries
        for ($i = 1; $i <= 50; $i++) {
            $gas = $gases[array_rand($gases)];
            $produk = [
                'id' => $i,
                'no_botol' => str_pad($i, 3, '0', STR_PAD_LEFT), // Pads the number with leading zeros
                'nama_produk' => $gas['nama_produk'], // Uses the selected gas name
                'simbol' => $gas['simbol'], // Uses the selected gas symbol
                'harga' => rand(10000, 50000), // Generates a random price between 10,000 and 50,000
            ];

            \App\Models\Produk::create($produk);
        }
    }
}
