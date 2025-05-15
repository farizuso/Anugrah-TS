// tests/Index.test.tsx
import { render, screen } from "@testing-library/react";
import Index from "./Index";
import { describe, it, expect, vi } from "vitest";

// Mock layout dan komponen DataTable
vi.mock("@/Layouts/AdminLayout", () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/Components/DataTable", () => ({
    DataTable: ({ data, columns }: any) => (
        <div>
            DataTable mocked - {data.length} rows, {columns.length} columns
        </div>
    ),
}));

const mockStokLogs = {
    data: [
        {
            id: 1,
            produk: { id: 101, nama_produk: "Nitrogen" },
            tipe: "masuk",
            jumlah: 10,
            sisa_stok: 50,
            keterangan: "Penambahan awal",
            tanggal: "2025-05-14T08:00:00Z",
        },
    ],
    links: [],
};

describe("Index StokLogs Page", () => {
    it("renders DataTable with stok log data", () => {
        render(<Index stokLogs={mockStokLogs} />);
        expect(screen.getByText(/DataTable mocked/)).toBeInTheDocument();
        expect(screen.getByText(/1 rows/)).toBeInTheDocument();
    });
});
