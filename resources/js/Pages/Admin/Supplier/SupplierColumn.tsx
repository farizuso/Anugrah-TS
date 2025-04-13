import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@/types"; // Sesuaikan dengan tipe data Anda
import { Checkbox } from "@/Components/ui/checkbox";
import Delete from "./Delete";
import Edit from "./Edit";

// import { Edit } from "./Edit"; // Pastikan sudah ada komponen Edit

// Definisikan kolom tabel supplier
export const SupplierColumns: ColumnDef<Supplier>[] = [
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
        accessorKey: "nama_supplier", // Pastikan `nama_supplier` ada di data Supplier
        header: "Nama Supplier",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nama_supplier")}</div>
        ),
    },
    {
        accessorKey: "alamat",
        header: "Alamat",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("alamat")}</div>
        ),
    },
    {
        accessorKey: "no_telp",
        header: "No_Telp",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("no_telp")}</div>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-center">Action</div>,
        enableHiding: false,
        cell: ({ row }) => {
            const supplier = row.original;

            return (
                <div className="justify-center flex items-center gap-2 ">
                    <Delete supplierdelete={supplier} />
                    <Edit supplieredit={supplier} />
                </div>
            );
        },
    },
];
