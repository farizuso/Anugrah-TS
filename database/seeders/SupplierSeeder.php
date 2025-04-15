<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data supplier tanpa menyertakan kolom 'id', karena id auto increment
        $suppliers = [
            [
                'nama_supplier' => 'Samator Gas',
                'alamat' => 'Jl. Raya Kedung Baruk No 25-28 Kedung Baruk, Rungkut, Surabaya 60298 Jawa Timur, Indonesia',
                'no_telp' => '08123456789',
            ],
            [
                'nama_supplier' => 'Gotty Gas',
                'alamat' => 'JL Tridarma, No. 3 Kav. E-4, Gresik, Jawa Timur, Indonesia',
                'no_telp' => '08123456789',
            ]
        ];

        foreach ($suppliers as $supplier) {
            \App\Models\Supplier::create($supplier);
        }
    }
}