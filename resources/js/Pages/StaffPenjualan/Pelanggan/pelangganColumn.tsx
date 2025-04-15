// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Pelanggan, Produk } from "@/types"; // Sesuaikan dengan tipe data Anda
import Delete from "./Delete";
import Edit from "./Edit";
import { Button } from "@/Components/ui/button"
import { Checkbox } from "@/Components/ui/checkbox"
import { ArrowUpDown } from "lucide-react";


// Definisikan kolom tabel produk
export const pelangganColumns: ColumnDef<Pelanggan>[] = [
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
    accessorKey: "nama_pelanggan",
    header: "Nama Pelanggan",
    cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nama_pelanggan")}</div>
    ),
},
{
    accessorKey: "alamat",
    header: ({ column }) => {
        return (
            <Button
                variant="grey"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Alamat
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("alamat")}</div>,
},
{
    accessorKey: "no_hp",
    header: "No Telp Aktif",
    cell: ({ row }) => (
        <div className="capitalize">{row.getValue("no_hp")}</div>
    ),
},
{
    id: "actions",
    header: () => <div className="text-center">action</div>,
    enableHiding: false,
    cell: ({ row }) => {
        const pelanggan = row.original

        return (

            <div className="justify-center flex items-center gap-2 ">
                <Delete pelanggandelete={pelanggan} />
                <Edit pelangganedit={pelanggan} />
            </div>
        )
    },
},

];
