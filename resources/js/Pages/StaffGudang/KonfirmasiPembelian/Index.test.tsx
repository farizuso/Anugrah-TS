import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Index from "./Index";

(global as any).route = vi.fn().mockImplementation((name?: string) => {
    const fn = () => `/mocked/${name ?? "unknown"}`;
    fn.current = (target: string) => false; // atau true untuk halaman aktif
    return fn;
});

vi.mock("@inertiajs/react", () => {
    return {
        usePage: () => ({
            props: {
                auth: {
                    user: { id: 1, name: "Staff Gudang", role: "gudang" },
                },
                flash: {},
            },
        }),
        Link: ({ href, children }: any) => <a href={href}>{children}</a>,
        Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

// mock DataTable seperti sebelumnya
vi.mock("@/Components/DataTable", () => ({
    DataTable: ({ data, columns }: any) => {
        const tableStub = {
            getIsAllPageRowsSelected: () => false,
            getIsSomePageRowsSelected: () => false,
            toggleAllPageRowsSelected: vi.fn(),
        };

        return (
            <table>
                <thead>
                    <tr>
                        {columns.map((col: any, i: number) => (
                            <th key={i}>
                                {typeof col.header === "function"
                                    ? col.header({
                                          column: col,
                                          table: tableStub,
                                      })
                                    : col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row: any) => (
                        <tr key={row.id}>
                            <td>{row.supplier?.nama_supplier}</td>
                            <td>{row.keterangan}</td>
                            <td>{row.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    },
}));

describe("Halaman Konfirmasi Laporan Pembelian", () => {
    it("menampilkan data laporan dalam tabel", () => {
        const mockData = [
            {
                id: 1,
                tgl_pembelian: "2024-01-15",
                supplier: { nama_supplier: "PT Supplier Bagus" },
                keterangan: "Lunas",
                status: "Dikonfirmasi",
                details: [],
                total: 100000,
            },
        ];

        render(<Index posts={mockData} produks={[]} suppliers={[]} />);

        expect(screen.getByText("PT Supplier Bagus")).toBeInTheDocument();
        expect(screen.getByText("Lunas")).toBeInTheDocument();
        expect(screen.getByText("Dikonfirmasi")).toBeInTheDocument();
    });
});
