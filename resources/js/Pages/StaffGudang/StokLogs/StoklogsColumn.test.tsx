import { render, screen } from "@testing-library/react";
import { StokLogsColumns, StokLog } from "./StokLogsColumn";
import { ColumnDef } from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { describe, it, expect } from "vitest";
import React from "react";

// Helper test table component
function TestTable({ data }: { data: StokLog[] }) {
    const table = useReactTable({
        data,
        columns: StokLogsColumns as ColumnDef<StokLog>[],
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const mockData: StokLog[] = [
    {
        id: 1,
        produk: { id: 1, nama_produk: "Oksigen" },
        tipe: "masuk",
        jumlah: 10,
        sisa_stok: 50,
        keterangan: "Pengisian rutin",
        tanggal: "2025-05-14T08:30:00Z",
    },
    {
        id: 2,
        produk: { id: 2, nama_produk: "Nitrogen" },
        tipe: "keluar",
        jumlah: 5,
        sisa_stok: 45,
        keterangan: null,
        tanggal: "2025-05-13T10:00:00Z",
    },
];

describe("StokLogsColumns", () => {
    it("should render formatted tanggal", () => {
        render(<TestTable data={[mockData[0]]} />);
        expect(screen.getByText("14 Mei 2025 15:30")).toBeInTheDocument(); // waktu UTC+7
    });

    it("should render nama produk", () => {
        render(<TestTable data={[mockData[0]]} />);
        expect(screen.getByText("Oksigen")).toBeInTheDocument();
    });

    it("should render tipe 'MASUK' in green", () => {
        render(<TestTable data={[mockData[0]]} />);
        const cell = screen.getByText("MASUK");
        expect(cell).toBeInTheDocument();
        expect(cell).toHaveClass("text-green-600");
    });

    it("should render tipe 'KELUAR' in red", () => {
        render(<TestTable data={[mockData[1]]} />);
        const cell = screen.getByText("KELUAR");
        expect(cell).toBeInTheDocument();
        expect(cell).toHaveClass("text-red-600");
    });

    it("should render jumlah and sisa_stok", () => {
        render(<TestTable data={[mockData[0]]} />);
        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("should render keterangan if available", () => {
        render(<TestTable data={[mockData[0]]} />);
        expect(screen.getByText("Pengisian rutin")).toBeInTheDocument();
    });

    it("should render '-' if keterangan is null", () => {
        render(<TestTable data={[mockData[1]]} />);
        expect(screen.getByText("-")).toBeInTheDocument();
    });
});
