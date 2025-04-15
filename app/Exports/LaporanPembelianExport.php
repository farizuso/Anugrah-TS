<?php

namespace App\Exports;

use App\Models\LaporanPembelian;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;

class LaporanPembelianExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        // Mengambil data LaporanPembelian dengan relasi supplier dan produk
        $laporan = LaporanPembelian::with(['supplier', 'details.produk'])->get();

        // Debugging: Verifikasi apakah relasi supplier dimuat
        dd($laporan);

        $data = collect();

        // Loop melalui setiap laporan pembelian
        foreach ($laporan as $item) {
            foreach ($item->details as $detail) {
                $row = [
                    'Tanggal Pembelian' => $item->tgl_pembelian,
                    'Nama Supplier' => $item->supplier->nama_supplier,
                    'Nama Produk' => $detail->produk->nama_produk ?? 'PRODUK NULL',
                    'Harga' => $detail->harga,
                    'Quantity' => $detail->quantity,
                    'Total' => $detail->harga * $detail->quantity,
                    'Keterangan' => $item->keterangan,
                ];

                $data->push($row);
            }
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'Tanggal Pembelian',
            'Nama Supplier',
            'Nama Produk',
            'Harga',
            'Quantity',
            'Total',
            'Keterangan',
        ];
    }
}
