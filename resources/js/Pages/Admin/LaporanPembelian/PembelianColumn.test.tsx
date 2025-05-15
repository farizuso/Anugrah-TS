import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { PembelianColumns } from "./PembelianColumn";

// 🔧 Mock Edit & Delete agar tidak error
vi.mock("./Delete", () => ({
    default: () => <button>Delete</button>,
}));
vi.mock("./Edit", () => ({
    default: () => <button>Edit</button>,
}));

// ✅ Komponen pengujian table
const TestTable = () => {
    const data = [
        {
            id: 1,
            tgl_pembelian: "2024-01-15",
            supplier: { nama_supplier: "PT Supplier Bagus" },
            details: [
                {
                    produk: { nama_produk: "Produk A" },
                    quantity: 5,
                    harga: 100000,
                },
                {
                    produk: { nama_produk: "Produk B" },
                    quantity: 2,
                    harga: 50000,
                },
            ],
            total: 600000,
            keterangan: "Lunas",
            status: "Dikonfirmasi",
        },
    ];

    const table = useReactTable({
        data,
        columns: PembelianColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell, i) => (
                            <td key={i}>
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

describe("PembelianColumns", () => {
    it("renders row data correctly", () => {
        render(<TestTable />);

        expect(screen.getByText("15 Januari 2024")).toBeInTheDocument();
        expect(screen.getByText("PT Supplier Bagus")).toBeInTheDocument();
        expect(screen.getByText("Produk A")).toBeInTheDocument();
        expect(screen.getByText("Produk B")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(
            screen.getByText(
                (text) => text.includes("Rp") && text.includes("100.000")
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                (text) => text.includes("Rp") && text.includes("50.000")
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                (text) => text.includes("Rp") && text.includes("600.000")
            )
        ).toBeInTheDocument();

        expect(screen.getByText("Lunas")).toBeInTheDocument();
        expect(screen.getByText("Dikonfirmasi")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
        expect(screen.getByText("Edit")).toBeInTheDocument();
    });
});
