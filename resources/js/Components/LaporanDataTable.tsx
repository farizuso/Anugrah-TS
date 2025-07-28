// File: resources/js/Components/LaporanDataTable.tsx

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
import { rankItem } from "@tanstack/match-sorter-utils";
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
import { formatRupiah } from "@/lib/utils";

interface LaporanDataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    excelName?: string;
    excelMap?: (item: T) => Record<string, string | number>;
    getTotal?: (data: T[]) => number;
}

export function LaporanDataTable<T>({
    data,
    columns,
    excelName = "laporan.xlsx",
    excelMap,
    getTotal,
}: LaporanDataTableProps<T>) {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [showCustom, setShowCustom] = React.useState(false);

    const filteredData = React.useMemo(() => {
        if (!startDate || !endDate) return data;
        const start = new Date(startDate.setHours(0, 0, 0, 0));
        const end = new Date(endDate.setHours(23, 59, 59, 999));
        return data.filter((row: any) => {
            const date = new Date(row.tgl_pesanan || row.tgl_pembelian || row.tanggal);
            return date >= start && date <= end;
        });
    }, [data, startDate, endDate]);
    console.log(data);

    const totalNilai = React.useMemo(() => {
        return getTotal ? getTotal(filteredData) : 0;
    }, [filteredData, getTotal]);

    const applyQuickFilter = (type: string) => {
        const now = new Date();
        let from: Date, to: Date;

        switch (type) {
            case "today":
                from = new Date(now.setHours(0, 0, 0, 0));
                to = new Date(now.setHours(23, 59, 59, 999));
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

    const exportToExcel = () => {
        const rows = excelMap ? filteredData.map(excelMap) : filteredData;
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Laporan");

        const getDateStr = (date: Date) => date.toISOString().split("T")[0];
        let fileName = excelName;

        if (startDate && endDate) {
            fileName = `${excelName.replace(".xlsx", "")}_${getDateStr(
                startDate
            )}_sampai_${getDateStr(endDate)}.xlsx`;
        }

        XLSX.writeFile(wb, fileName);
    };

    const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({ itemRank });
        return itemRank.passed;
    };

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        filterFns: { fuzzy: fuzzyFilter },
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

            {getTotal && (
                <div className="flex justify-end items-center space-x-4 py-4">
                    <div className="text-sm font-semibold">
                        Total:{" "}
                        <span className="text-green-600">
                            {formatRupiah(totalNilai)}
                        </span>
                    </div>
                </div>
            )}

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
