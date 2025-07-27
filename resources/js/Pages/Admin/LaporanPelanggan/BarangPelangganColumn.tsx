// File: resources/js/Pages/Admin/BarangPelangganColumn.tsx

import { formatTanggalIndonesiaTok } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export type BarangPelanggan = {
    nama_pelanggan: string;
    nama_produk: string;
    jumlah_beli: number;
    tgl_pesanan: string;
};

export const BarangPelangganColumns: ColumnDef<BarangPelanggan>[] = [
    {
        accessorKey: "tgl_pesanan",
        header: "Tanggal Pesanan",
        cell: ({ row }) => formatTanggalIndonesiaTok(row.original.tgl_pesanan),
    },
    {
        accessorKey: "nama_pelanggan",
        header: "Nama Pelanggan",
    },
    {
        accessorKey: "nama_produk",
        header: "Nama Produk",
    },
    {
        accessorKey: "jumlah_beli",
        header: "Jumlah Beli",
    },
];

