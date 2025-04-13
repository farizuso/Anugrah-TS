// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Produk } from "@/types"; // Sesuaikan dengan tipe data Anda
import Delete from "./Delete";
import Edit from "./Edit";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

// Definisikan kolom tabel produk
export const produkColumns: ColumnDef<Produk>[] = [
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
        accessorKey: "nama_produk",
        header: ({ column }) => {
            return (
                <Button
                    variant="grey"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Produk
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nama_produk")}</div>
        ),
    },
    {
        accessorKey: "simbol",
        header: ({ column }) => {
            return (
                <Button
                    variant="grey"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Simbol
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("simbol")}</div>
        ),
    },
    {
        accessorKey: "jenis",
        header: ({ column }) => {
            return (
                <Button
                    variant="grey"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Jenis
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("jenis")}</div>
        ),
    },
    {
        accessorKey: "harga_jual",
        header: () => <div className="text-left">Harga Jual</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("harga_jual"));

            // Format the amount as a Rupiah amount
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR", // Gunakan "IDR" untuk Rupiah
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">action</div>,
        enableHiding: false,
        cell: ({ row }) => {
            const produk = row.original;

            return (
                <div className="justify-center flex items-center gap-2 ">
                    <Delete produkdelete={produk} />
                    <Edit produkedit={produk} />
                </div>
            );
        },
    },
];
