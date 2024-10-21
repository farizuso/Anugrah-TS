// src/Components/columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { Pelanggan, Produk, Stok } from "@/types"; // Sesuaikan dengan tipe data Anda
// import Delete from "./Delete";
// import Edit from "./Edit";
import { Button } from "@/Components/ui/button"
import { Checkbox } from "@/Components/ui/checkbox"
import { ArrowUpDown } from "lucide-react";


// Definisikan kolom tabel produk
export const stokColumns: ColumnDef<Stok>[] = [
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
    accessorKey: "nama_produk",
    header: "Nama Produk",
    cell: ({ row }) => (
        <div className="capitalize">
            {row.original.produk.nama_produk}</div>
    ),
    accessorFn: (row) => row.produk.nama_produk,
},
{
    accessorKey: "lokasi_penyimpanan",
    header: ({ column }) => {
        return (
            <Button
                variant="grey"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                lokasi_penyimpanan
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("lokasi_penyimpanan")}</div>,
},
{
    accessorKey: "jumlah_stok",
    header: "jumlah Stok",
    cell: ({ row }) => (
        <div className="capitalize">{row.getValue("jumlah_stok")}</div>
    ),
},
{
    accessorKey: "minimum_stok",
    header: "Minimum Stok",
    cell: ({ row }) => (
        <div className="capitalize">{row.getValue("minimum_stok")}</div>
    ),
},
{
    accessorKey: "tgl_update_stok",
    header: ({ column }) => {
        return (
            <Button
                variant="grey"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Tgl. update stok
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        );
    },
    cell: ({ row }) => (
        <div className="lowercase">
            {new Date(row.original.tgl_update_stok).toLocaleDateString()}
        </div>
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
                {/* <Delete pelanggandelete={pelanggan} />
                <Edit pelangganedit={pelanggan} /> */}
            </div>
        )
    },
},

];
