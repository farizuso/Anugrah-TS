import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ProdukColumns } from "./ProdukColumn";
import { Produk } from "@/types";
import React from "react";

const produkMock: Produk = {
    id: 1,
    nama_produk: "Gas Elpiji 3kg",
    simbol: "elpiji3",
    kategori: "Tabung",
    harga_jual: "15000",
    stok: { jumlah_stok: 3 },
};

describe("ProdukColumns", () => {
    it("should render product name", () => {
        const column = ProdukColumns.find(
            (c) => c.accessorKey === "nama_produk"
        );
        const cell = column?.cell?.({
            row: { getValue: () => produkMock.nama_produk },
        } as any);
        const { getByText } = render(<>{cell}</>);
        expect(getByText("Gas Elpiji 3kg")).toBeTruthy();
    });

    it("should render symbol", () => {
        const column = ProdukColumns.find((c) => c.accessorKey === "simbol");
        const cell = column?.cell?.({
            row: { getValue: () => produkMock.simbol },
        } as any);
        const { getByText } = render(<>{cell}</>);
        expect(getByText("elpiji3")).toBeTruthy();
    });

    it("should render category", () => {
        const column = ProdukColumns.find((c) => c.accessorKey === "kategori");
        const cell = column?.cell?.({
            row: { getValue: () => produkMock.kategori },
        } as any);
        const { getByText } = render(<>{cell}</>);
        expect(getByText("Tabung")).toBeTruthy();
    });

    it("should render low stock warning if stock < 5", () => {
        const column = ProdukColumns.find((c) => c.id === "jumlah_stok");
        const cell = column?.cell?.({ row: { original: produkMock } } as any);
        const { getByText } = render(<>{cell}</>);
        expect(getByText(/Segera restok/)).toBeTruthy();
    });

    it("should render 'Belum ada' if stock is null", () => {
        const column = ProdukColumns.find((c) => c.id === "jumlah_stok");
        const cell = column?.cell?.({
            row: { original: { ...produkMock, stok: null } },
        } as any);
        const { getByText } = render(<>{cell}</>);
        expect(getByText("Belum ada")).toBeTruthy();
    });

    it("should format harga_jual to IDR", () => {
        const column = ProdukColumns.find(
            (c) => c.accessorKey === "harga_jual"
        );
        const cell = column?.cell?.({
            row: { getValue: () => produkMock.harga_jual },
        } as any);
        const { getByText } = render(<>{cell}</>);
        expect(getByText(/\bRp\s?15\.000,00\b/)).toBeTruthy();
    });
});
