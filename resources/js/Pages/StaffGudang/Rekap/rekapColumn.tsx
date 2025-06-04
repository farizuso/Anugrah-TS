import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Rekap } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import Deleterkp from "./Delete";
import Edit from "./Edit";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { router } from "@inertiajs/react";
import ConfirmReturn from "@/Components/ConfirmReturn";
import { formatTanggalIndonesia } from "@/lib/utils";

// Helper untuk format tanggal
function formatDate(value?: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "-";
}

export const rekapColumns: ColumnDef<Rekap>[] = [
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
    // {
    //     accessorKey: "pesanan_id",
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             onClick={() =>
    //                 column.toggleSorting(column.getIsSorted() === "asc")
    //             }
    //         >
    //             ID Pesanan <ArrowUpDown className="ml-2 h-4 w-4" />
    //         </Button>
    //     ),
    //     cell: ({ row }) => row.original.pesanan.id,
    // },
    {
        accessorKey: "pelanggan",
        header: "Pelanggan",
        cell: ({ row }) =>
            row.original.pesanan?.pelanggan?.nama_pelanggan ?? "-",
    },

    {
        accessorKey: "nomor_tabung",
        header: "Nomor Tabung",
        cell: ({ row }) => row.original.nomor_tabung ?? "-",
    },

    {
        id: "tanggal_keluar",
        accessorFn: (row) =>
            formatTanggalIndonesia(row.tanggal_keluar.toString()), // hasil string misalnya "18 Mei 2025"
        header: ({ column }) => (
            <Button
                variant="default"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Tgl. Keluar
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("tanggal_keluar")}</div>
        ),
        enableGlobalFilter: true,
        filterFn: "includesString", // atau "fuzzy" jika kamu pakai fuzzy matching
    },

    {
        accessorKey: "tanggal_kembali",
        header: ({ column }) => (
            <Button
                variant="default"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Tgl. Kembali <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const tanggal = row.original.tanggal_kembali; // akses dari relasi pesanan
            const formattedDate =
                tanggal && typeof tanggal === "string"
                    ? format(new Date(tanggal), "dd MMMM yyyy", { locale: id })
                    : "-";
            return <div>{formattedDate}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status as string;

            const badgeClass =
                {
                    kembali: "bg-green-500 text-white font-bold",
                    dipinjam: "bg-yellow-100 text-yellow-700",
                    "Belum Dikonfirmasi": "bg-yellow-500 text-black",
                    Dikonfirmasi: "bg-green-500 text-white font-bold",
                }[status] || "bg-yellow-500 text-black font-bold";

            return (
                <span
                    className={`capitalize inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}
                >
                    {status}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Aksi",
        enableHiding: false,
        cell: ({ row }) => {
            const rekap = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Edit rekapedit={rekap} />
                    <Deleterkp rekapdelete={rekap} />
                    <ConfirmReturn rekap={rekap} />
                </div>
            );
        },
    },
];
