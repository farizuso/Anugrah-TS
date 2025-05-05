import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Rekap } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import Deleterkp from "./Delete";
import Edit from "./Edit";

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
    {
        accessorKey: "pesanan_id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                ID Pesanan <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.original.pesanan_id,
    },
    {
        accessorKey: "pelanggan",
        header: "Pelanggan",
        cell: ({ row }) => row.original.pelanggan ?? "-",
    },
    {
        accessorKey: "nomor_tabung",
        header: "Nomor Tabung",
        cell: ({ row }) => row.original.nomor_tabung ?? "-",
    },
    {
        accessorKey: "tanggal_keluar",
        header: "Tanggal Keluar",
        cell: ({ row }) => formatDate(row.original.tanggal_keluar),
    },
    {
        accessorKey: "tanggal_kembali",
        header: "Tanggal Kembali",
        cell: ({ row }) => formatDate(row.original.tanggal_kembali),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                    row.original.status === "kembali"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                }`}
            >
                {row.original.status}
            </span>
        ),
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
                </div>
            );
        },
    },
];
