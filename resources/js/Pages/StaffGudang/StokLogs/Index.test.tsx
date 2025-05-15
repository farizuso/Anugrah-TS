import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Index from "./Index";
import { StokLog } from "./StokLogsColumn";

// Dummy data
const dummyLogs: StokLog[] = [
    {
        id: 1,
        produk: {
            id: 101,
            nama_produk: "Gas Elpiji 3kg",
        },
        tipe: "masuk",
        jumlah: 10,
        sisa_stok: 50,
        keterangan: "Pengisian ulang",
        tanggal: "2024-01-15T08:00:00Z",
    },
];

// Mock DataTable dan Layout agar fokus ke data
vi.mock("@/Components/DataTable", () => ({
    DataTable: ({ data }: any) => (
        <div>
            DataTable with {data.length} rows
            {data.map((row: StokLog) => (
                <div key={row.id}>
                    <span>{row.produk.nama_produk}</span>
                    <span>{row.tipe}</span>
                    <span>{row.jumlah}</span>
                    <span>{row.sisa_stok}</span>
                    <span>{row.keterangan}</span>
                </div>
            ))}
        </div>
    ),
}));

vi.mock("@/Layouts/AdminLayout", () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));

describe("Stok Logs Index Page", () => {
    it("should render DataTable with correct data", () => {
        render(
            <Index
                stokLogs={{
                    data: dummyLogs,
                    links: [],
                }}
            />
        );

        expect(screen.getByText("DataTable with 1 rows")).toBeInTheDocument();
        expect(screen.getByText("Gas Elpiji 3kg")).toBeInTheDocument();
        expect(screen.getByText("masuk")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("50")).toBeInTheDocument();
        expect(screen.getByText("Pengisian ulang")).toBeInTheDocument();
    });
});
