import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export type StokLog = {
    id: number;
    produk: {
        id: number;
        nama_produk: string;
    };
    tipe: "masuk" | "keluar";
    jumlah: number;
    sisa_stok: number;
    keterangan: string | null;
    tanggal: string;
};

export const StokLogsColumns: ColumnDef<StokLog>[] = [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => {
            const tanggal = row.original.tanggal;
            const formattedDate = tanggal
                ? format(new Date(tanggal), "dd MMMM yyyy", {
                      locale: id,
                  })
                : "-";
            return <div>{formattedDate}</div>;
        },
    },
    {
        accessorKey: "produk.nama_produk",
        header: "Produk",
        cell: ({ row }) => row.original.produk?.nama_produk || "-",
    },

    {
        accessorKey: "tipe",
        header: "Tipe",
        cell: ({ row }) => {
            const tipe = row.original.tipe;
            const tipeClass =
                tipe === "masuk"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold";
            return <div className={tipeClass}>{tipe.toUpperCase()}</div>;
        },
    },
    {
        accessorKey: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => (
            <div className="font-bold">{row.original.jumlah}</div>
        ),
    },
    {
        accessorKey: "sisa_stok",
        header: "Sisa Stok",
        cell: ({ row }) => (
            <div className="text-left">{row.original.sisa_stok}</div>
        ),
    },

    {
        accessorKey: "keterangan",
        header: "Keterangan",
        cell: ({ row }) => row.original.keterangan || "-",
    },
];
