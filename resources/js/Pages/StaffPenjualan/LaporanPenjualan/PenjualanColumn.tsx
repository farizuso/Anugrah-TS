import { ColumnDef } from "@tanstack/react-table";
import { LaporanPembelian, Pesanan, User } from "@/types";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { ArrowUpDown, Eye } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { router } from "@inertiajs/react";
import Delete from "../Pesanan/Delete";
import Edit from "../Pesanan/Edit";
import Detail from "../Pesanan/Detail";
import { Link } from "@inertiajs/react";

// Gunakan parameter opsional + default fallback
export const PenjualanColumns: ColumnDef<Pesanan>[] = [
    {
        accessorKey: "tgl_pesanan",
        header: "Tanggal",
        cell: ({ row }) => {
            const tgl_pesanan = row.original.tgl_pesanan;
            return format(new Date(tgl_pesanan), "dd-MM-yyyy");
        },
    },
    {
        accessorKey: "id",
        header: "No Pesanan",
        cell: ({ row }) => `#${row.original.id}`,
    },
    {
        accessorKey: "pelanggan.nama_pelanggan",
        header: "Pelanggan",
        cell: ({ row }) => row.original.pelanggan?.nama_pelanggan || "-",
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            const formatRupiah = (angka: number) =>
                `Rp ${angka.toLocaleString("id-ID")}`;
            return (
                <div className="text-right">
                    {formatRupiah(row.original.total)}
                </div>
            );
        },
    },
    {
        accessorKey: "jumlah_terbayar",
        header: "Dibayar",
        cell: ({ row }) => {
            const formatRupiah = (angka: number) =>
                `Rp ${angka.toLocaleString("id-ID")}`;
            return (
                <div className="text-right">
                    {formatRupiah(row.original.jumlah_terbayar)}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="text-center capitalize">{row.original.status}</div>
        ),
    },
    {
        accessorKey: "keterangan",
        header: "Pembayaran",
        cell: ({ row }) => (
            <div className="text-center capitalize">
                {row.original.keterangan}
            </div>
        ),
    },
];
