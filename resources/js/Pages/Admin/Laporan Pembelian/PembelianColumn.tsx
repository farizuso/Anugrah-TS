// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { LaporanPembelian } from "@/types"; // Sesuaikan dengan tipe data Anda
import Delete from "./Delete";

import { Button } from "@/Components/ui/button"
import { Checkbox } from "@/Components/ui/checkbox"
import { ArrowUpDown } from "lucide-react";



// Definisikan kolom tabel laporan penjualan
export const PembelianColumns: ColumnDef<LaporanPembelian>[] = [
  {
    id: "select",
    header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: "tgl_pembelian",
    header: "tgl_Pembelian",
    cell: ({ row }) => (
        <div className="capitalize">{row.getValue("tgl_pembelian")}</div>
    ),
    
},
{
    accessorKey: "nama_supplier",
    header: ({ column }) => {
        return (
            <Button
                variant="grey"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nama supplier
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("nama_supplier")}</div>,
},
{
    accessorKey: "nama_produk",
    header: ({ column }) => {
        return (
            <Button
                variant="grey"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nama Produk
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("nama_produk")}</div>,
},
{
    accessorKey: "quantity",
    header: ({ column }) => {
        return (
            <Button
                variant="grey"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                QTY
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("quantity")}</div>,
},
{
    accessorKey: "harga",
    header: () => <div className="text-left">Harga</div>,
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("harga"));

        // Format the amount as a Rupiah amount
        const formatted = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR", // Gunakan "IDR" untuk Rupiah
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
    },
},
{
    accessorKey: "keterangan",
    header: "Keterangan",
    cell: ({ row }) => (
        <div className="capitalize">{row.original.keterangan}</div>
    ),
},
{
    id: "actions",
    header: () => <div className="text-center">action</div>,
    enableHiding: false,
    cell: ({ row }) => {
        const laporanpembelian = row.original

        return (

            <div className="justify-center flex items-center gap-2 ">
                <Delete pembeliandelete={laporanpembelian} />
                <Edit laporanpembelianedit={laporanpembelian} />
            </div>
        )
    },
},

];
