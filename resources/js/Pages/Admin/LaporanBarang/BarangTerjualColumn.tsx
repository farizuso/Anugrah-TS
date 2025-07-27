// File: resources/js/Pages/Admin/BarangTerjualColumn.tsx

import { ColumnDef } from "@tanstack/react-table";

export type BarangTerjual = {
    produk: { nama_produk: string };
    total_qty: number;
    total_pendapatan: number;
};

export const BarangTerjualColumns: ColumnDef<BarangTerjual>[] = [
    {
        accessorKey: "produk.nama_produk",
        header: "Nama Produk",
        cell: ({ row }) => row.original.produk.nama_produk,
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
            const nilai = row.original.total_pendapatan;
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(nilai);
        },
    },
];
