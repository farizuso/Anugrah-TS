import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import TabsDemo from "./Index";
import React from "react";
import { Produk } from "@/types";

(global as any).route = vi.fn((name?: string) => {
    return {
        current: (check: string) => check === name,
        toString: () => `/${name}`,
    };
});

// Mock usePage (Inertia) dan useForm
vi.mock("@inertiajs/react", () => {
    return {
        // Hook
        usePage: () => ({
            props: {
                auth: { user: { name: "Test User" } },
                flash: {},
            },
        }),
        useForm: () => ({
            data: {},
            setData: vi.fn(),
            post: vi.fn(),
            processing: false,
            errors: {},
            reset: vi.fn(),
        }),

        // Komponen
        Link: ({ children }: any) => <a>{children}</a>,
        Head: ({ title }: { title: string }) => <title>{title}</title>,

        // Router
        router: {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        },
    };
});

// Mock DataTable
vi.mock("@/Components/DataTable", () => ({
    DataTable: ({ data, columns }: any) => (
        <div>
            <div>Mocked DataTable</div>
            <div>Jumlah Produk: {data.length}</div>
            <div>Kolom: {columns?.length}</div>
        </div>
    ),
}));

// Dummy posts
const mockPosts: Produk[] = [
    {
        id: 1,
        nama_produk: "Gas Elpiji 3kg",
        simbol: "elpiji3",
        kategori: "Tabung",
        harga_jual: "15000",
        stok: { jumlah_stok: 5 },
    },
];

describe("Index (TabsDemo)", () => {
    it("should render DataTable with correct data and columns", () => {
        const { getByText } = render(<TabsDemo posts={mockPosts} />);
        expect(getByText("Mocked DataTable")).toBeTruthy();
        expect(getByText("Jumlah Produk: 1")).toBeTruthy();
        expect(getByText(/Kolom: \d+/)).toBeTruthy();
    });
});
