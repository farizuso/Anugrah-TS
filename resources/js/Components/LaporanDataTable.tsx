import * as React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    FilterFn,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { SearchIcon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Calendar } from "@/Components/ui/calendar";
import { rankItem } from "@tanstack/match-sorter-utils";

// Interface untuk detail pembelian
interface Detail {
    produk: { nama_produk: string };
    harga: number;
    quantity: number;
}

// Interface untuk Laporan Pembelian yang lebih spesifik
interface LaporanPembelian {
    tgl_pembelian: string;
    supplier: { nama_supplier: string };
    keterangan: string;
    details: Detail[];
}

// Props untuk DataTable
interface LaporanDataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
}

// Komponen LaporanDataTable
export function LaporanDataTable<TData extends LaporanPembelian>({
    data,
    columns,
}: LaporanDataTableProps<TData>) {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [showCustom, setShowCustom] = React.useState(false);

    // Filter data berdasarkan rentang tanggal
    const filteredData = React.useMemo(() => {
        if (!startDate || !endDate) return data;
        return data.filter((row) => {
            const date = new Date(row.tgl_pembelian);
            return date >= startDate && date <= endDate;
        });
    }, [data, startDate, endDate]);

    // Menghitung total harga
    const totalPrice = React.useMemo(() => {
        return filteredData.reduce((total, item) => {
            if (item.details && Array.isArray(item.details)) {
                item.details.forEach((detail) => {
                    total += detail.harga * detail.quantity;
                });
            }
            return total;
        }, 0);
    }, [filteredData]);

    // Menghitung total kuantitas
    const totalQuantity = React.useMemo(() => {
        return filteredData.reduce((total, item) => {
            if (item.details && Array.isArray(item.details)) {
                item.details.forEach((detail) => {
                    total += detail.quantity;
                });
            }
            return total;
        }, 0);
    }, [filteredData]);

    // Mengatur filter cepat berdasarkan rentang tanggal
    const applyQuickFilter = (type: string) => {
        const now = new Date();
        let from: Date, to: Date;

        switch (type) {
            case "today":
                from = new Date(now.setHours(0, 0, 0, 0)); // Set waktu mulai ke 00:00:00
                to = new Date();
                to.setHours(23, 59, 59, 999); // Set waktu akhir ke 23:59:59
                break;
            case "thisMonth":
                from = new Date(now.getFullYear(), now.getMonth(), 1);
                to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case "thisYear":
                from = new Date(now.getFullYear(), 0, 1);
                to = new Date(now.getFullYear(), 11, 31);
                break;
            case "last7Days":
                to = new Date();
                from = new Date();
                from.setDate(to.getDate() - 6);
                break;
            default:
                from = to = now;
        }

        setStartDate(from);
        setEndDate(to);
        setShowCustom(false);
    };

    // Ekspor data yang sudah difilter ke dalam file Excel
    const exportToExcel = () => {
        const rows: any[] = [];

        filteredData.forEach((item) => {
            if (item.details && Array.isArray(item.details)) {
                item.details.forEach((detail) => {
                    rows.push({
                        "Tanggal Pembelian": item.tgl_pembelian,
                        "Nama Supplier": item.supplier?.nama_supplier ?? "-",
                        "Nama Produk": detail.produk?.nama_produk ?? "-",
                        Harga: detail.harga,
                        Quantity: detail.quantity,
                        Subtotal: detail.harga * detail.quantity,
                        Keterangan: item.keterangan ?? "",
                    });
                });
            } else {
                rows.push({
                    "Tanggal Pembelian": item.tgl_pembelian,
                    "Nama Supplier": item.supplier?.nama_supplier ?? "-",
                    "Nama Produk": "-",
                    Harga: 0,
                    Quantity: 0,
                    Subtotal: 0,
                    Keterangan: item.keterangan ?? "",
                });
            }
        });

        // Menggunakan library XLSX untuk menulis dan mengunduh file Excel
        const ws = XLSX.utils.json_to_sheet(rows); // Mengubah data menjadi sheet
        const wb = XLSX.utils.book_new(); // Membuat buku baru
        XLSX.utils.book_append_sheet(wb, ws, "Laporan Pembelian"); // Menambahkan sheet ke dalam buku

        // Menyimpan file Excel
        XLSX.writeFile(wb, "laporan_pembelian.xlsx");
    };

    // Filter fuzzy untuk pencarian
    const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({
            itemRank,
        });
        return itemRank.passed;
    };

    // Setting up table dengan react-table hooks
    const table = useReactTable({
        data: filteredData,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        filterFns: { fuzzy: fuzzyFilter }, // Menambahkan filter fuzzy
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                {["today", "thisMonth", "thisYear", "last7Days"].map((type) => (
                    <Button
                        key={type}
                        variant="outline"
                        onClick={() => applyQuickFilter(type)}
                    >
                        {
                            {
                                today: "Hari Ini",
                                thisMonth: "Bulan Ini",
                                thisYear: "Tahun Ini",
                                last7Days: "7 Hari Terakhir",
                            }[type]
                        }
                    </Button>
                ))}
                <Button
                    variant="outline"
                    onClick={() => setShowCustom(!showCustom)}
                >
                    Rentang Kustom
                </Button>
                <div className="relative ml-auto">
                    <Input
                        placeholder="Cari..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-10"
                    />
                    <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <Button onClick={exportToExcel}>Ekspor Excel</Button>
            </div>

            {showCustom && (
                <div className="flex flex-wrap gap-4 items-center">
                    <div>
                        <span className="block text-sm">Dari:</span>
                        <Calendar
                            mode="single"
                            selected={startDate ?? undefined}
                            onSelect={(date) => setStartDate(date ?? null)}
                        />
                    </div>
                    <div>
                        <span className="block text-sm">Sampai:</span>
                        <Calendar
                            mode="single"
                            selected={endDate ?? undefined}
                            onSelect={(date) => setEndDate(date ?? null)}
                        />
                    </div>
                </div>
            )}

            <div className="rounded border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id}>
                                {group.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center py-8"
                                >
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Display Total at the bottom right */}
            <div className="flex justify-end items-center space-x-4 py-4">
                <div className="text-sm">
                    <strong>Total Jumlah Pembelian:</strong> {totalQuantity}{" "}
                    Produk
                </div>
                <div className="text-sm">
                    <strong>Total Harga:</strong> Rp{" "}
                    {totalPrice.toLocaleString()}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
