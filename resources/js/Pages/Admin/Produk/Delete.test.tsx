import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import Delete from "./Delete";

vi.mock("@inertiajs/react", () => ({
    useForm: () => ({
        delete: vi.fn(),
        data: {},
        setData: vi.fn(),
        post: vi.fn(),
        processing: false,
        errors: {},
        reset: vi.fn(),
    }),
}));

describe("Delete component", () => {
    const produk = {
        id: 1,
        nama_produk: "Oksigen",
        simbol: "O2",
        kategori: "Gas",
        harga_jual: 10000,
    };

    it("renders delete button and opens dialog", () => {
        render(<Delete produkdelete={produk} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(screen.getByText(/konfirmasi/i)).toBeInTheDocument();
        expect(screen.getByText(/hapus data/i)).toBeInTheDocument();
    });
});
