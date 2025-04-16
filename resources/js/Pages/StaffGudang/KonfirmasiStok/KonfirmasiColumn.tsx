import { ColumnDef } from "@tanstack/react-table";
import { LaporanPembelian } from "@/types";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns"; // Import format dari date-fns
import { id } from "date-fns/locale";

export const KonfirmasiColumns: ColumnDef<LaporanPembelian>[] = [
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
        header: ({ column }) => {
            return (
                <Button
                    variant="default"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Tgl. Pembelian
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const tanggal = row.getValue("tgl_pembelian");
            // Pastikan tanggal dalam bentuk Date dan format dengan locale Indonesia
            const formattedDate =
                tanggal && typeof tanggal === "string"
                    ? format(new Date(tanggal), "dd MMMM yyyy", { locale: id })
                    : "-";

            return <div>{formattedDate}</div>;
        },
    },
    {
        accessorFn: (row) => row.supplier?.nama_supplier || "-", // Gunakan hanya accessorFn
        header: "Nama Supplier",
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.supplier?.nama_supplier || "-"}
            </div>
        ),
    },
    {
        header: "Nama Produk",
        cell: ({ row }) => (
            <div className="space-y-1">
                {(row.original.details || []).map((item, index) => (
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
                {(row.original.details || []).map((item, index) => (
                    <div key={index} className="before:content-['•_']">
                        {item.quantity}
                    </div>
                ))}
            </div>
        ),
    },
    {
        accessorKey: "status", // Gunakan accessorKey
        header: "status",
        cell: ({ row }) => {
            const status = row.original.status?.toLowerCase();
            const className =
                status === "lunas"
                    ? "text-green-600 font-semibold"
                    : status === "belum lunas"
                    ? "text-red-600 font-semibold"
                    : "text-gray-700";
            return (
                <div className={`capitalize ${className}`}>
                    {row.original.status}
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
                    {/* <Delete pembeliandelete={laporanpembelian} />
                    <Edit pembelianedit={laporanpembelian} /> */}
                </div>
            );
        },
    },
];

export default KonfirmasiColumns;
