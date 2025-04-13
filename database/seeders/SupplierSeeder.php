<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $suppliers = [
            [
                'id' => 1,
                'nama_supplier' => 'samator gas',
                'alamat' => 'Jl. Raya Kedung Baruk No 25-28 Kedung Baruk, Rungkut, Surabaya 60298 Jawa Timur, Indonesia',
                'no_telp' => '08123456789',
            ],
            [
                'id' => 2,
                'nama_supplier' => 'Gotty gas',
                'alamat' => 'JL Tridarma, No. 3 Kav. E-4, Gresik, Jawa Timur, Indonesia',
                'no_telp' => '08123456789',
            ]
        ];

        foreach ($suppliers as $supplier) {
            \App\Models\Supplier::create($supplier);
        }
    }
}