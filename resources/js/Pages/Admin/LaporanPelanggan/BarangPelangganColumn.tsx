// File: resources/js/Pages/Admin/BarangPelangganColumn.tsx

import { ColumnDef } from "@tanstack/react-table";

export type BarangPelanggan = {
    produk: { nama_produk: string };
    jumlah_beli: number;
    pesanan: {
        pelanggan: { nama_pelanggan: string };
    };
};

export const BarangPelangganColumns: ColumnDef<BarangPelanggan>[] = [
    {
        accessorKey: "pesanan.pelanggan.nama_pelanggan",
        header: "Nama Pelanggan",
        cell: ({ row }) =>
            row.original.pesanan.pelanggan?.nama_pelanggan || "-",
    },
    {
        accessorKey: "produk.nama_produk",
        header: "Nama Produk",
        cell: ({ row }) => row.original.produk.nama_produk,
    },
    {
        accessorKey: "jumlah_beli",
        header: "Jumlah Beli",
        cell: ({ row }) => row.original.jumlah_beli,
    },
];
