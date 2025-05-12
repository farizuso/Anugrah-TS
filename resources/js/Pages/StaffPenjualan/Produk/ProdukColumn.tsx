// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Produk } from "@/types";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

// Kolom DataTable untuk Produk
export const ProdukColumns: ColumnDef<Produk>[] = [
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
        header: ({ column }) => (
            <Button
                variant="grey"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Nama Produk
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nama_produk")}</div>
        ),
    },
    {
        accessorKey: "simbol",
        header: ({ column }) => (
            <Button
                variant="grey"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Simbol
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("simbol")}</div>
        ),
    },
    {
        accessorKey: "kategori",
        header: ({ column }) => (
            <Button
                variant="grey"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Jenis
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("kategori")}</div>
        ),
    },
    {
        id: "jumlah_stok",
        header: ({ column }) => (
            <Button
                variant="grey"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Stok
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorFn: (row) => row.stok?.jumlah_stok ?? 0,
        cell: ({ row }) => {
            const stok = row.original.stok?.jumlah_stok;

            if (stok === undefined || stok === null) {
                return <div className="text-gray-400 italic">Belum ada</div>;
            }

            return stok < 5 ? (
                <div className="text-red-600 font-semibold">
                    Segera restok (sisa: {stok})
                </div>
            ) : (
                <div>{stok}</div>
            );
        },
    },
    {
        accessorKey: "harga_jual",
        header: () => <div className="text-left">Harga Jual</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("harga_jual"));
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
        },
    },
];
