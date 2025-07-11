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
        $file = database_path('data/pelanggan.csv');

        if (!file_exists($file)) {
            echo "File pelanggan.csv tidak ditemukan!\n";
            return;
        }

        $csv = array_map('str_getcsv', file($file));
        $header = array_map('trim', $csv[0]); // Ambil header
        unset($csv[0]); // Hapus header dari data

        $count = 0;

        foreach ($csv as $row) {
            // Skip baris kosong atau tidak sesuai kolom
            if (count(array_filter($row)) === 0 || count($row) !== count($header)) {
                continue;
            }

            $data = array_combine($header, array_map('trim', $row));

            \App\Models\Pelanggan::create([
                'nama_pelanggan' => $data['nama_pelanggan'],
                'alamat'         => $data['alamat'],
                'no_hp'          => $data['no_hp'],
            ]);

            $count++;
        }

        echo "$count data pelanggan berhasil diimport dari CSV.\n";
    }
}
