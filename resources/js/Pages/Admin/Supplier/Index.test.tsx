// Index.test.tsx
import React, { useState } from "react"; // ✅ PENTING
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Index from "./Index";

// 👉 Global mock route() agar tidak error
(global as any).route = vi.fn().mockImplementation((name: string) => {
    const mockUrl = `/mocked/${name}`;
    const routeFn = () => mockUrl;
    routeFn.current = (currentName: string) => currentName === name;
    return routeFn;
});

// ✅ Mock inertia
vi.mock("@inertiajs/react", () => {
    return {
        useForm: () => {
            const [data, setDataState] = useState({
                nama_supplier: "",
                alamat: "",
                no_telp: "",
            });

            const setData = (key, value) => {
                setDataState((prev) => ({ ...prev, [key]: value }));
            };

            return {
                data,
                setData,
                post: vi.fn(),
                processing: false,
                errors: {},
                reset: vi.fn(),
                delete: vi.fn(),
            };
        },

        usePage: () => ({
            props: {
                flash: { success: "Mocked flash success" },
                produks: [],
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

describe("Index Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the form and tab interface correctly", () => {
        render(<Index posts={[]} />);

        expect(
            screen.getByRole("heading", { name: "Tambah Data Supplier" })
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Nama Supplier")).toBeInTheDocument();
        expect(screen.getByLabelText("Alamat")).toBeInTheDocument();
        expect(screen.getByLabelText("No_Telp")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Simpan Data Supplier" })
        ).toBeInTheDocument();
    });

    it("can type into inputs", () => {
        render(<Index posts={[]} />);
        const namaInput = screen.getByPlaceholderText("Masukkan Nama Supplier");

        fireEvent.change(namaInput, {
            target: { value: "PT Contoh Supplier" },
        });

        expect(namaInput).toHaveValue("PT Contoh Supplier");
    });
});
