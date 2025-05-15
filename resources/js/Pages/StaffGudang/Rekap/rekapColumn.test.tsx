import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { rekapColumns } from "./rekapColumn";
import { Rekap } from "@/types";

// Mock komponen aksi
vi.mock("./Edit", () => ({
    __esModule: true,
    default: () => <button>Edit</button>,
}));
vi.mock("./Delete", () => ({
    __esModule: true,
    default: () => <button>Delete</button>,
}));
vi.mock("@/Components/ConfirmReturn", () => ({
    __esModule: true,
    default: () => <button>Return</button>,
}));

// Dummy data
const dummyData: Rekap[] = [
    {
        id: 1,
        status: "kembali",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        nomor_tabung: "TAB123",
        tanggal_kembali: "2024-01-10",
        tabung_per_produk: [],
        pesanan: {
            id: 1,
            pelanggan: { nama_pelanggan: "Budi" },
            details: [],
            tgl_pesanan: "2024-01-01",
        },
    },
];

const TestTable = () => {
    const table = useReactTable({
        data: dummyData,
        columns: rekapColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                      )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
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
};

describe("rekapColumns", () => {
    it("renders all column values and action buttons correctly", () => {
        render(<TestTable />);

        // Cek data dari dummy
        expect(screen.getByText("Budi")).toBeInTheDocument();
        expect(screen.getByText("TAB123")).toBeInTheDocument();
        expect(screen.getByText("10 Januari 2024")).toBeInTheDocument(); // Tanggal kembali diformat
        expect(screen.getByText("01 Januari 2024")).toBeInTheDocument(); // Tgl pesanan

        // Cek status badge
        expect(screen.getByText("kembali")).toBeInTheDocument();

        // Cek tombol aksi
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
        expect(screen.getByText("Return")).toBeInTheDocument();
    });
});
