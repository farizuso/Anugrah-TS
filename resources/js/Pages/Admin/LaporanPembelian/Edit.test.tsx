import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Edit from "./Edit";

// Mock route()
(global as any).route = vi.fn(
    (name: string, id: number) => `/mocked/${name}/${id}`
);

// Global post mock
const putMock = vi.fn();

// Mock useForm dan usePage
vi.mock("@inertiajs/react", () => ({
    useForm: () => ({
        data: {
            tgl_pembelian: new Date("2024-01-01"),
            supplier_id: "1",
            produk: [
                {
                    produk_id: "2",
                    harga: "10000",
                    quantity: "1",
                },
            ],
            total: 10000,
            keterangan: "Lunas",
        },
        setData: vi.fn(),
        put: putMock,
        processing: false,
        errors: {},
        reset: vi.fn(),
    }),
    usePage: () => ({
        props: {
            produks: [{ id: 2, nama_produk: "Produk X" }],
            suppliers: [{ id: 1, nama_supplier: "Supplier Y" }],
        },
    }),
}));

describe("Edit Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders edit dialog and submits", () => {
        render(
            <Edit
                pembelianedit={{
                    id: 456,
                    tgl_pembelian: "2024-01-01",
                    supplier: { id: 1, nama_supplier: "Supplier Y" },
                    details: [
                        {
                            produk: { id: 2, nama_produk: "Produk X" },
                            harga: 10000,
                            quantity: 1,
                        },
                    ],
                    keterangan: "Lunas",
                    total: 10000,
                }}
            />
        );

        // Buka dialog
        const openBtn = screen.getByRole("button");
        fireEvent.click(openBtn);

        // Pastikan form muncul
        expect(screen.getByText("Edit Laporan Pembelian")).toBeInTheDocument();

        // Klik submit
        const submitBtn = screen.getByText("Simpan Perubahan");
        fireEvent.click(submitBtn);

        // Pastikan fungsi put dipanggil
        expect(putMock).toHaveBeenCalled();
    });
});
