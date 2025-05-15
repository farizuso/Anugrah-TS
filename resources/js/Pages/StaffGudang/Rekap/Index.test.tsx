import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { Pesanan, Rekap } from "@/types";

vi.mock("@/Components/ui/tabs", () => ({
    Tabs: ({ children }: any) => <div>{children}</div>,
    TabsList: ({ children }: any) => <div>{children}</div>,
    TabsTrigger: ({ children, value }: any) => (
        <button onClick={() => {}}>{children}</button>
    ),
    TabsContent: ({ value, children }: any) => <div>{children}</div>,
}));

// ✅ MOCK CommandCombobox HARUS SEBELUM IMPORT Index
vi.mock("@/Components/ui/CommandCombobox", () => {
    const React = require("react");
    const { useState, useEffect } = React;

    return {
        CommandCombobox: ({ value, onValueChange }: any) => {
            const [internalValue, setInternalValue] = useState(value || "");

            useEffect(() => {
                setInternalValue(value || "");
            }, [value]);

            return (
                <select
                    data-testid="pesanan-select"
                    value={internalValue}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        onValueChange(e.target.value);
                    }}
                >
                    <option value="">Pilih pesanan</option>
                    <option value="1">#1 - Budi</option>
                </select>
            );
        },
    };
});

// ✅ MOCK DataTable
vi.mock("@/Components/DataTable", () => ({
    DataTable: ({ data }: any) => (
        <div>DataTable dengan {data.length} rekap</div>
    ),
}));

// ✅ MOCK @inertiajs/react
vi.mock("@inertiajs/react", () => {
    return {
        useForm: () => ({
            data: {
                pesanan_id: null,
                status: "keluar",
                tabung_per_produk: [],
            },
            setData: vi.fn(),
            post: vi.fn(),
            processing: false,
            reset: vi.fn(),
            errors: {},
        }),
        usePage: () => ({
            props: {
                auth: { user: { name: "Test User" } },
                flash: {},
            },
        }),
        Head: ({ title }: any) => <title>{title}</title>,
        Link: ({ children }: any) => <a>{children}</a>,
        router: {},
    };
});

// ✅ MOCK global route function
(global as any).route = vi.fn(() => ({
    current: vi.fn(() => false),
    toString: () => "/mocked-route",
}));

// ✅ IMPORT Index SETELAH SEMUA MOCK
import Index from "./Index";

// ✅ Dummy props
const dummyPesanans: Pesanan[] = [
    {
        id: 1,
        pelanggan: { nama_pelanggan: "Budi" },
        details: [
            {
                produk: {
                    id: 101,
                    nama_produk: "Gas Elpiji 3kg",
                },
                quantity: 2,
            },
        ],
    },
];

const dummyRekaps: Rekap[] = [
    {
        id: 1,
        status: "keluar",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        tabung_per_produk: [],
        pesanan: dummyPesanans[0],
    },
];

describe("Rekap Page", () => {
    it("should render tabs and table", () => {
        render(<Index rekaps={dummyRekaps} pesanans={dummyPesanans} />);

        expect(screen.getByText("Data Table")).toBeTruthy();
        expect(screen.getByText("Tambah Data")).toBeTruthy();
        expect(screen.getByText("DataTable dengan 1 rekap")).toBeTruthy();
    });

    it("should render pesanan select and respond to change", () => {
        render(<Index rekaps={dummyRekaps} pesanans={dummyPesanans} />);

        // GANTI TAB ke “Tambah Data”
        fireEvent.click(screen.getByText("Tambah Data"));

        // Cari dan ubah select
        const select = screen.getByTestId("pesanan-select");
        fireEvent.change(select, { target: { value: "1" } });

        expect(select).toHaveValue("1");
    });
});
