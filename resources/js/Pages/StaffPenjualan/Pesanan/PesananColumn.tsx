import { ColumnDef } from "@tanstack/react-table";
import { LaporanPembelian, Pesanan, User } from "@/types";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { ArrowUpDown, Eye } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { router } from "@inertiajs/react";
import Delete from "./Delete";
import Edit from "./Edit";
import Detail from "./Detail";
import { Link } from "@inertiajs/react";
import { formatTanggalIndonesia, formatTanggalIndonesiaTok } from "@/lib/utils";

// Gunakan parameter opsional + default fallback
export const PesananColumns: ColumnDef<Pesanan>[] = [
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
        id: "tgl_pesanan",
        accessorFn: (row) => formatTanggalIndonesia(row.tgl_pesanan.toString()), // hasil string misalnya "18 Mei 2025"
        header: ({ column }) => (
            <Button
                variant="default"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Tgl. Pesanan
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{formatTanggalIndonesia(row.original.tgl_pesanan.toString())}</div>
        ),
        enableGlobalFilter: true,
        filterFn: "includesString", // atau "fuzzy" jika kamu pakai fuzzy matching
    },
    {
        accessorKey: "nomor_invoice", // ─┐
        id: "nomor_invoice", //  │ keduanya opsional—pakai salah satu
        header: "Nomor Invoice", // ─┘
        accessorFn: (row) => row.nomor_invoice ?? `#${row.id}`,
        enableGlobalFilter: true,
        filterFn: "fuzzy",
        cell: ({ row }) => row.getValue("nomor_invoice"),
    },
    {
        accessorFn: (row) => row.pelanggan?.nama_pelanggan || "-",
        header: "Nama Pelanggan",
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.pelanggan?.nama_pelanggan || "-"}
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
    // {
    //     header: "Harga",
    //     cell: ({ row }) => (
    //         <div className="space-y-1">
    //             {(row.original.details || []).map((item, index) => (
    //                 <div key={index} className="before:content-['•_']">
    //                     {new Intl.NumberFormat("id-ID", {
    //                         style: "currency",
    //                         currency: "IDR",
    //                     }).format(item.harga)}
    //                 </div>
    //             ))}
    //         </div>
    //     ),
    // },
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            const badgeClass =
                {
                    Pending: "bg-yellow-400 text-black font-bold",
                    Dikirim: "bg-blue-500 text-white font-bold",
                    Selesai: "bg-green-600 text-white font-bold",
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
            const pesanan = row.original;
            return (
                <div className="justify-center flex items-center gap-2">
                    {/* Delete hanya tampil jika status bukan Dikirim atau Selesai */}
                    {pesanan.status !== "Dikirim" &&
                        pesanan.status !== "Selesai" && (
                            <Delete pesanandelete={pesanan} />
                        )}

                    {/* Edit hanya tampil jika status bukan Selesai */}
                    {pesanan.status !== "Selesai" && (
                        <Edit pesananedit={pesanan} />
                    )}

                    <Link
                        href={route(
                            "staffpenjualan.pesanan.detail",
                            pesanan.id
                        )}
                    >
                        <Button variant="outline_yellow" size={"sm"}>
                            <Eye />
                        </Button>
                    </Link>
                </div>
            );
        },
    },
];
