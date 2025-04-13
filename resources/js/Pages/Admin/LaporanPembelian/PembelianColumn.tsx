import { ColumnDef } from "@tanstack/react-table";
import { LaporanPembelian } from "@/types";
import Delete from "./Delete";
import Edit from "./Edit";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

export const PembelianColumns: ColumnDef<LaporanPembelian>[] = [
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
        accessorKey: "tgl_pembelian",
        header: "Tanggal Pembelian",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("tgl_pembelian")}</div>
        ),
    },
    {
        accessorKey: "nama_supplier",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Nama Supplier
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nama_supplier")}</div>
        ),
    },
    {
        header: "Nama Produk",
        cell: ({ row }) => (
            <div className="space-y-1">
                {row.original.details.map((item, index) => (
                    <div
                        key={index}
                        className="capitalize before:content-['•_']"
                    >
                        {item.produk?.nama_produk || "-"}
                    </div>
                ))}
            </div>
        ),
    },
    {
        header: "QTY",
        cell: ({ row }) => (
            <div className="space-y-1">
                {row.original.details.map((item, index) => (
                    <div key={index} className="before:content-['•_']">
                        {item.quantity}
                    </div>
                ))}
            </div>
        ),
    },
    {
        header: "Harga",
        cell: ({ row }) => (
            <div className="space-y-1">
                {row.original.details.map((item, index) => (
                    <div key={index} className="before:content-['•_']">
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(item.harga)}
                    </div>
                ))}
            </div>
        ),
    },
    {
        header: "Total Harga",
        cell: ({ row }) => {
            const total = row.original.total;
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(total);
            return <div className="font-bold text-green-600">{formatted}</div>;
        },
        footer: ({ table }) => {
            const totalSeluruh = table
                .getFilteredRowModel()
                .rows.reduce((sum, row) => sum + row.original.total, 0);

            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(totalSeluruh);

            return <div className="font-bold text-green-700">{formatted}</div>;
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
    {
        id: "actions",
        header: () => <div className="text-center">Action</div>,
        enableHiding: false,
        cell: ({ row }) => {
            const laporanpembelian = row.original;

            return (
                <div className="justify-center flex items-center gap-2">
                    <Delete pembeliandelete={laporanpembelian} />
                    <Edit pembelianedit={laporanpembelian} />
                </div>
            );
        },
    },
];

export default PembelianColumns;
