<?php

namespace App\Exports;

use App\Models\LaporanPembelian;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class LaporanPembelianExport implements FromCollection, WithHeadings, WithStrictNullComparison, WithColumnFormatting
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        $data = LaporanPembelian::with('supplier', 'details.produk')
            ->whereBetween('tgl_pembelian', [$this->startDate, $this->endDate])
            ->get()
            ->map(function ($laporan) {
                return [
                    'Tanggal Pembelian' => $laporan->tgl_pembelian,
                    'Nama Supplier' => data_get($laporan, 'supplier.nama_supplier', '-'),
                    'Nama Produk' => $laporan->details->pluck('produk.nama_produk')->implode(', ') ?? '-',
                    'Harga' => $laporan->details->sum('harga'),
                    'Quantity' => $laporan->details->sum('quantity'),
                    'Total' => $laporan->details->sum(function ($detail) {
                        return $detail->harga * $detail->quantity;
                    }),
                    'Keterangan' => $laporan->keterangan,
                ];
            });

        // sementara kembalikan data ke browser, bukan file Excel
        return response()->json($data);
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

    public function columnFormats(): array
    {
        return [
            'D' => NumberFormat::FORMAT_NUMBER, // Harga
            'E' => NumberFormat::FORMAT_NUMBER, // Quantity
            'F' => NumberFormat::FORMAT_NUMBER, // Total
        ];
    }
}