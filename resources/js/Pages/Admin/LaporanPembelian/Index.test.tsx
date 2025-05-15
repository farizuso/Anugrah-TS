import React, { useState } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TabsDemo from "./Index";

// ✅ Variabel global untuk melacak pemanggilan `post()`
const postMock = vi.fn();

// ✅ Mock global route
(global as any).route = vi.fn().mockImplementation((name: string) => {
    const fn = () => `/mocked/${name}`;
    fn.current = () => false;
    return fn;
});

// ✅ Mock inertia lengkap
vi.mock("@inertiajs/react", () => {
    return {
        useForm: () => {
            const [data, setDataState] = useState({
                tgl_pembelian: new Date("2024-01-01"),
                supplier_id: "1",
                produk: [{ produk_id: "1", harga: "10000", quantity: "2" }],
                total: 20000,
                keterangan: "Lunas",
                status: "",
            });

            const setData = (key, value) => {
                setDataState((prev) => ({ ...prev, [key]: value }));
            };

            return {
                data,
                setData,
                post: postMock, // ✅ Gunakan postMock
                processing: false,
                errors: {},
                reset: vi.fn(),
                delete: vi.fn(),
            };
        },
        usePage: () => ({
            props: {
                auth: { user: { id: 1 } },
                flash: {},
            },
        }),
        Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        Link: ({ href, children, ...rest }: any) => (
            <a href={href} {...rest}>
                {children}
            </a>
        ),
    };
});

describe("Laporan Pembelian Form", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders form fields correctly", () => {
        render(
            <TabsDemo
                posts={[]}
                produks={[]}
                suppliers={[]}
                defaultTab="form"
            />
        );

        expect(
            screen.getByRole("heading", { name: "Tambah Laporan Pembelian" })
        ).toBeInTheDocument();
        expect(screen.getByText("Tanggal Pembelian")).toBeInTheDocument();
        expect(screen.getByText("Nama Supplier")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Harga")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Qty")).toBeInTheDocument();
        expect(screen.getByText("Simpan Laporan")).toBeInTheDocument();
    });

    it("can type into harga and quantity", () => {
        render(
            <TabsDemo
                posts={[]}
                produks={[]}
                suppliers={[]}
                defaultTab="form"
            />
        );

        const hargaInput = screen.getByPlaceholderText("Harga");
        fireEvent.change(hargaInput, { target: { value: "120000" } });
        expect(hargaInput).toHaveValue("Rp 120.000");

        const qtyInput = screen.getByPlaceholderText("Qty");
        fireEvent.change(qtyInput, { target: { value: "2" } });
        expect(qtyInput).toHaveValue(2);
    });

    it("calls post on submit", () => {
        render(
            <TabsDemo
                posts={[]}
                produks={[]}
                suppliers={[]}
                defaultTab="form"
            />
        );

        const submitButton = screen.getByText("Simpan Laporan");
        fireEvent.click(submitButton);

        expect(postMock).toHaveBeenCalled(); // ✅ Sekarang bisa dilacak
    });
});
