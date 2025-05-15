// tests/Index.test.tsx
import { render, screen } from "@testing-library/react";
import Index from "./Index";
import { describe, it, expect, vi } from "vitest";

// Mock Layout & Component UI
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

const mockRekaps = [
    {
        id: 1,
        nomor_tabung: "TBG-001",
        tanggal_kembali: "2025-05-10",
        status: "kembali",
        pesanan: {
            tgl_pesanan: "2025-05-01",
            pelanggan: {
                nama_pelanggan: "Rudi",
            },
        },
    },
];

describe("Index Rekap Component", () => {
    it("renders DataTable with rekaps data", () => {
        render(<Index rekaps={mockRekaps} pesanans={[]} />);
        expect(screen.getByText(/DataTable mocked/)).toBeInTheDocument();
        expect(screen.getByText(/1 rows/)).toBeInTheDocument();
    });
});
