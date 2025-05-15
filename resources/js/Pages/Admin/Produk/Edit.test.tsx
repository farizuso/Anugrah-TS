import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import Edit from "./Edit";

vi.mock("@inertiajs/react", () => ({
    useForm: () => ({
        put: vi.fn(),
        data: {
            nama_produk: "Nitrogen",
            simbol: "N2",
            kategori: "Gas",
            harga_jual: 50000,
        },
        setData: vi.fn(),
        processing: false,
        errors: {},
    }),
}));

describe("Edit component", () => {
    const produk = {
        id: 2,
        nama_produk: "Nitrogen",
        simbol: "N2",
        kategori: "Gas",
        harga_jual: 50000,
    };

    it("renders form fields correctly", () => {
        render(<Edit produkedit={produk} />);
        fireEvent.click(screen.getByRole("button"));

        expect(screen.getByLabelText(/Nama Produk/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Simbol/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Kategori/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Harga Jual/i)).toBeInTheDocument();
    });
});
