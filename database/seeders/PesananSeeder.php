<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pesanan;
use App\Models\PesananDetail;
use App\Models\Pelanggan;
use App\Models\Produk;

class PesananSeeder extends Seeder
{
    public function run()
    {
        $pelanggan = Pelanggan::first(); // Ambil pelanggan pertama
        $produk = Produk::first(); // Ambil produk pertama

        if (!$pelanggan || !$produk) {
            $this->command->error("Seeder gagal: pelanggan atau produk belum tersedia.");
            return;
        }

        $total = 2 * 100000;

        $lastId = Pesanan::max('id') + 1;
        $nomorInvoice = 'INV-' . now()->format('Ymd') . '-' . str_pad($lastId, 5, '0', STR_PAD_LEFT);

        $pesanan = Pesanan::create([
            'nomor_invoice' => $nomorInvoice,
            'tgl_pesanan' => now()->toDateString(),
            'pelanggan_id' => $pelanggan->id,
            'total' => $total,
            'jenis_pesanan' => 'campuran',
            'status' => 'Pending',
            'jumlah_terbayar' => 0,
            'is_lunas' => false,
            'keterangan' => 'Seeder Pesanan',
        ]);

        PesananDetail::create([
            'pesanan_id' => $pesanan->id,
            'produk_id' => $produk->id,
            'harga' => 100000,
            'quantity' => 2,
            'tipe_item' => 'jual',
            'durasi' => 0,
        ]);
    }
}
