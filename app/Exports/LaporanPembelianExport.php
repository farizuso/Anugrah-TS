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
        $laporan = LaporanPembelian::with('details.produk')->get();

        $data = collect();

        foreach ($laporan as $item) {
            foreach ($item->details as $detail) {
                $data->push([
                    'Tanggal Pembelian' => $item->tgl_pembelian,
                    'Nama Supplier' => $item->nama_supplier,
                    'Nama Produk' => $detail->produk->nama_produk ?? '-',
                    'Harga' => $detail->harga,
                    'Quantity' => $detail->quantity,
                    'Total' => $detail->harga * $detail->quantity,
                    'Keterangan' => $item->keterangan,
                ]);
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