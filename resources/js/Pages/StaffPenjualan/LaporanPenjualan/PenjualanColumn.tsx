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
import { formatTanggalIndonesia } from "@/lib/utils";

// Gunakan parameter opsional + default fallback
export const PenjualanColumns: ColumnDef<Pesanan>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "tgl_pesanan",
        accessorFn: (row) => formatTanggalIndonesia(row.tgl_pesanan.toString()), // hasil string misalnya "18 Mei 2025"
        header: ({ column }) => (
            <Button
                variant="default"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Tgl. Pesanan
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{formatTanggalIndonesia(row.original.tgl_pesanan.toString())}</div>
        ),
        enableGlobalFilter: true,
        filterFn: "includesString", // atau "fuzzy" jika kamu pakai fuzzy matching
    },
    {
        accessorKey: "nomor_invoice", // ─┐
        id: "nomor_invoice", //  │ keduanya opsional—pakai salah satu
        header: "Nomor Invoice", // ─┘
        accessorFn: (row) => row.nomor_invoice ?? `#${row.id}`,
        enableGlobalFilter: true,
        filterFn: "fuzzy",
        cell: ({ row }) => row.getValue("nomor_invoice"),
    },

    {
        accessorKey: "pelanggan.nama_pelanggan",
        header: "Pelanggan",
        cell: ({ row }) => row.original.pelanggan?.nama_pelanggan || "-",
    },
    {
        header: "Total Tagihan",
        cell: ({ row }) => {
            const total = row.original.total;
            const dibayar = row.original.jumlah_terbayar || 0;
            const keterangan = row.original.keterangan?.toLowerCase();
            const sisaTagihan = total - dibayar;

            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(
                keterangan === "cicilan" || keterangan === "belum lunas"
                    ? sisaTagihan
                    : 0
            );

            return <div className="font-bold text-red-600">{formatted}</div>;
        },
        footer: ({ table }) => {
            const totalSeluruh = table
                .getFilteredRowModel()
                .rows.reduce((sum, row) => {
                    const total = row.original.total;
                    const dibayar = row.original.jumlah_terbayar || 0;
                    const keterangan = row.original.keterangan?.toLowerCase();
                    const sisaTagihan = total - dibayar;
                    return (
                        sum +
                        (keterangan === "cicilan" ||
                        keterangan === "belum lunas"
                            ? sisaTagihan
                            : total)
                    );
                }, 0);
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(totalSeluruh);
            return <div className="font-bold text-green-700">{formatted}</div>;
        },
    },

    {
        accessorKey: "jumlah_terbayar",
        header: "Dibayar",
        cell: ({ row }) => {
            const totalTerbayar = row.original.jumlah_terbayar;
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(totalTerbayar);

            return (
                <div className="font-bold text-green-600 text-left">
                    {formatted}
                </div>
            );
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            const badgeClass =
                {
                    Pending: "bg-yellow-400 text-black font-bold",
                    Dikirim: "bg-blue-500 text-white font-bold",
                    Selesai: "bg-green-600 text-white font-bold",
                }[status] || "bg-gray-500 text-white font-bold";

            return (
                <div
                    className={`capitalize inline-flex items-center px-3 py-1 rounded-full ${badgeClass}`}
                >
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "keterangan",
        header: "Keterangan",
        cell: ({ row }) => {
            const status = row.original.keterangan?.toLowerCase();
            const className =
                status === "lunas"
                    ? "text-green-600 font-semibold"
                    : status === "belum lunas"
                    ? "text-red-600 font-semibold"
                    : "text-gray-700";
            return (
                <div className={`capitalize ${className}`}>
                    {row.original.keterangan}
                </div>
            );
        },
    },
];
