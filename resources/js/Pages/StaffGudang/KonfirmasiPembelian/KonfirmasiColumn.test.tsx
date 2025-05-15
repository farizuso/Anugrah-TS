import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { KonfirmasiColumns } from "./KonfirmasiColumn";
import { LaporanPembelian } from "@/types";
import { Table, createTable, getCoreRowModel } from "@tanstack/react-table";
import React from "react";

const mockData: LaporanPembelian[] = [
    {
        id: 1,
        tgl_pembelian: "2024-05-10",
        supplier: { nama_supplier: "PT Gasindo" },
        details: [
            { produk: { nama_produk: "Gas Elpiji 3kg" }, quantity: 10 },
            { produk: { nama_produk: "Gas Elpiji 12kg" }, quantity: 5 },
        ],
        status: "Belum Dikonfirmasi",
    },
];

describe("KonfirmasiColumns", () => {
    it("should render the correct supplier name", () => {
        const column = KonfirmasiColumns.find(
            (col) => col.header === "Nama Supplier"
        );
        const cell = column?.cell?.({
            row: {
                original: mockData[0],
            },
        } as any);
        const { getByText } = render(<>{cell}</>);
        expect(getByText("PT Gasindo")).toBeTruthy();
    });

    it("should render formatted date", () => {
        const column = KonfirmasiColumns.find(
            (col) => col.accessorKey === "tgl_pembelian"
        );
        const cell = column?.cell?.({
            row: {
                getValue: () => "2024-05-10",
            },
        } as any);
        const { getByText } = render(<>{cell}</>);
        expect(getByText("10 Mei 2024")).toBeTruthy();
    });

    it("should render status badge with correct style", () => {
        const column = KonfirmasiColumns.find(
            (col) => col.accessorKey === "status"
        );
        const cell = column?.cell?.({
            row: {
                getValue: () => "Belum Dikonfirmasi",
            },
        } as any);
        const { getByText } = render(<>{cell}</>);
        const badge = getByText("Belum Dikonfirmasi");
        expect(badge).toHaveClass("bg-yellow-500");
    });

    it("should render product names and quantities", () => {
        const produkCol = KonfirmasiColumns.find(
            (col) => col.header === "Nama Produk"
        );
        const qtyCol = KonfirmasiColumns.find((col) => col.header === "QTY");

        const row = { original: mockData[0] };
        const produkCell = produkCol?.cell?.({ row } as any);
        const qtyCell = qtyCol?.cell?.({ row } as any);

        const { getByText } = render(
            <>
                {produkCell}
                {qtyCell}
            </>
        );

        expect(getByText("Gas Elpiji 3kg")).toBeTruthy();
        expect(getByText("Gas Elpiji 12kg")).toBeTruthy();
        expect(getByText("10")).toBeTruthy();
        expect(getByText("5")).toBeTruthy();
    });
});
