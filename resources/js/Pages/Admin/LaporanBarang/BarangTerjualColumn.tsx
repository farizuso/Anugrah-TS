// File: resources/js/Pages/Admin/BarangTerjualColumn.tsx

import { formatRupiah, formatTanggalIndonesia, formatTanggalIndonesiaTok } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export type BarangTerjual = {
    nama_produk: string;
    total_qty: number;
    total_pendapatan: number;
    tgl_pesanan?: string;

};

export const BarangTerjualColumns: ColumnDef<BarangTerjual>[] = [
    {
        accessorKey: "tgl_pesanan",
        header: "Tanggal Pesanan",
        cell: ({ row }) => row.original.tgl_pesanan ? formatTanggalIndonesia(row.original.tgl_pesanan) : "-",

    },
    {
        accessorKey: "nama_produk",
        header: "Nama Produk",
        cell: ({ row }) => row.original.nama_produk,
    },
    {
        accessorKey: "total_qty",
        header: "Total Terjual",
        cell: ({ row }) => row.original.total_qty,
    },
    {
        accessorKey: "total_pendapatan",
        header: "Pendapatan",
        cell: ({ row }) => {
            return formatRupiah(row.original.total_pendapatan);
        },
    },
];
