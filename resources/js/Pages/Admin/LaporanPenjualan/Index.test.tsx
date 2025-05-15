import { render, screen } from "@testing-library/react";
import TabsDemo from "./Index";
import { describe, it, expect, vi } from "vitest";

// Mocks
vi.mock("@/Layouts/AdminLayout", () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@inertiajs/react", async () => {
    const actual = await vi.importActual("@inertiajs/react");
    return {
        ...actual,
        usePage: () => ({ props: {} }),
    };
});

vi.mock("@/Components/DataTable", () => ({
    DataTable: ({ data, columns }: any) => (
        <div>
            DataTable mocked - {data.length} rows, {columns.length} columns
        </div>
    ),
}));

const mockPenjualan = [
    {
        id: 1,
        tgl_pesanan: "2025-05-01",
        pelanggan: { nama_pelanggan: "Andi" },
        total: 200000,
        jumlah_terbayar: 100000,
        status: "Pending",
        keterangan: "Belum Lunas",
    },
];

describe("TabsDemo Component", () => {
    it("renders DataTable with penjualan data", () => {
        render(<TabsDemo penjualan={mockPenjualan} />);
        expect(screen.getByText(/DataTable mocked/)).toBeInTheDocument();
        expect(screen.getByText(/1 rows/)).toBeInTheDocument();
    });
});
