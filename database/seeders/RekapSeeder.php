<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\Rekap;
use Illuminate\Database\Seeder;

class RekapSeeder extends Seeder
{
    public function run(): void
    {
        $file = database_path('data/rekaps.csv');

        if (!file_exists($file)) {
            echo "File rekaps.csv tidak ditemukan!\n";
            return;
        }

        $csv = array_map('str_getcsv', file($file));
        $header = array_map('trim', $csv[0]);
        unset($csv[0]);

        $count = 0;
        $skipped = 0;

        // Ambil semua ID untuk randomisasi
        $pesananIds = Pesanan::pluck('id')->toArray();
        $produkIds = Produk::pluck('id')->toArray();

        foreach ($csv as $row) {
            if (count(array_filter($row)) === 0 || count($row) !== count($header)) {
                continue;
            }

            $data = array_combine($header, array_map('trim', $row));

            $pelanggan = Pelanggan::where('nama_pelanggan', $data['nama_pelanggan'])->first();

            if (!$pelanggan) {
                echo "Lewatkan baris: pelanggan '{$data['nama_pelanggan']}' tidak ditemukan.\n";
                $skipped++;
                continue;
            }

            // Ambil ID acak dari tabel pesanan dan produk
            $pesanan_id = $pesananIds[array_rand($pesananIds)] ?? null;
            $produk_id = $produkIds[array_rand($produkIds)] ?? null;

            if (!$pesanan_id || !$produk_id) {
                echo "Lewatkan baris: tidak ada pesanan atau produk yang tersedia.\n";
                $skipped++;
                continue;
            }

            Rekap::create([
                'pesanan_id' => $pesanan_id,
                'pelanggan_id' => $pelanggan->id,
                'produk_id' => $produk_id,
                'nomor_tabung' => $data['nomor_tabung'],
                'status' => $data['tanggal_kembali'] ? 'kembali' : 'keluar',
                'tanggal_keluar' => $data['tanggal_keluar'] ?: now(),
                'tanggal_kembali' => $data['tanggal_kembali'] ?: null,
            ]);

            $count++;
        }

        echo "$count data rekap berhasil diimport.\n";
        echo "$skipped baris dilewati karena pelanggan atau ID random tidak ditemukan.\n";
    }
}
