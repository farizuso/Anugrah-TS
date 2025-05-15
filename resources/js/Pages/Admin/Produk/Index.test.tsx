import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TabsDemo from "./Index";

const postMock = vi.fn();

vi.mock("@inertiajs/react", async () => {
    const actual = await vi.importActual("@inertiajs/react");
    return {
        ...actual,
        usePage: () => ({
            props: { flash: {} },
        }),
        useForm: () => ({
            data: {
                nama_produk: "",
                simbol: "",
                kategori: "",
                harga_jual: "",
            },
            setData: vi.fn(),
            post: postMock,
            reset: vi.fn(),
            processing: false,
            errors: {},
        }),
        Head: () => <></>,
    };
});

beforeEach(() => {
    // ✅ Mock route agar support .current
    global.route = vi.fn((name) => ({
        current: vi.fn(() => true),
        toString: () => `/${name}`,
    }));
});

describe("Tambah Produk Form", () => {
    it("renders form correctly", () => {
        render(<TabsDemo posts={[]} />);
        expect(screen.getByText(/Tambah Data Produk/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nama Produk/i)).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Masukkan simbol")
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Masukkan kategori produk")
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Contoh: Rp 120.000")
        ).toBeInTheDocument();
    });

    it("calls post function on form submit", () => {
        render(<TabsDemo posts={[]} />);

        fireEvent.change(screen.getByLabelText(/Nama Produk/i), {
            target: { value: "Laptop" },
        });
        fireEvent.change(screen.getByPlaceholderText("Masukkan simbol"), {
            target: { value: "LTP" },
        });
        fireEvent.change(
            screen.getByPlaceholderText("Masukkan kategori produk"),
            {
                target: { value: "Elektronik" },
            }
        );
        fireEvent.change(screen.getByPlaceholderText("Contoh: Rp 120.000"), {
            target: { value: "5000000" },
        });

        fireEvent.click(screen.getByText("Save Produk"));

        expect(postMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                onSuccess: expect.any(Function),
            })
        );
    });
});
