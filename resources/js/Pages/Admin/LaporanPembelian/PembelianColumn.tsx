import { ColumnDef } from "@tanstack/react-table";
import { LaporanPembelian, User } from "@/types";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { router } from "@inertiajs/react";
import Delete from "./Delete";
import Edit from "./Edit";
import { formatTanggalIndonesia } from "@/lib/utils";

// Gunakan parameter opsional + default fallback
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
        id: "tgl_pembelian",
        accessorFn: (row) =>
            formatTanggalIndonesia(row.tgl_pembelian.toString()), // hasil string misalnya "18 Mei 2025"
        header: ({ column }) => (
            <Button
                variant="default"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Tgl. pembelian
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("tgl_pembelian")}</div>
        ),
        enableGlobalFilter: true,
        filterFn: "includesString", // atau "fuzzy" jika kamu pakai fuzzy matching
    },
    {
        accessorFn: (row) => row.supplier?.nama_supplier || "-",
        header: "Nama Supplier",
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.supplier?.nama_supplier || "-"}
            </div>
        ),
    },
    {
        accessorFn: (row) => row.supplier?.no_telp || "-",
        header: "No_Telp",
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.supplier?.no_telp || "-"}
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
        header: "Harga",
        cell: ({ row }) => (
            <div className="space-y-1">
                {(row.original.details || []).map((item, index) => (
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
        header: "Sub Total",
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
        header: "PPN (11%)",
        cell: ({ row }) => {
            const ppn = row.original.ppn;
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(ppn);
        },
    },
    {
        header: "Grand Total",
        cell: ({ row }) => {
            const grand = row.original.grand_total;
            return (
                <span className="font-bold text-blue-600">
                    {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                    }).format(grand)}
                </span>
            );
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
        header: "Metode Pembayaran",
        accessorFn: (row) => row.metode_pembayaran || "-",
        cell: ({ row }) => (
            <span className="capitalize">{row.original.metode_pembayaran}</span>
        ),
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            const badgeClass =
                {
                    Dikonfirmasi: "bg-green-500 text-white font-bold",
                    "Belum Dikonfirmasi": "bg-yellow-500 text-black font-bold",
                }[status] || "bg-gray-500 text-white font-bold";

            return (
                <div
                    className={`capitalize inline-flex items-center px-3 py-1 rounded-full ${badgeClass}`}
                >
                    {status}
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
                    {laporanpembelian.status !== "Dikonfirmasi" && (
                        <>
                            <Delete pembeliandelete={laporanpembelian} />
                            <Edit pembelianedit={laporanpembelian} />
                        </>
                    )}
                </div>
            );
        },
    },
];
