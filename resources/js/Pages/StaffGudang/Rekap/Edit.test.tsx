import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import Edit from "./Edit";
import { Rekap } from "@/types";

// Mock inertia
const putMock = vi.fn();
vi.mock("@inertiajs/react", () => ({
    useForm: () => ({
        data: {
            nomor_tabung: "ABC123",
            status: "dipinjam",
            tanggal_kembali: "",
        },
        setData: vi.fn(),
        put: putMock,
        processing: false,
        errors: {},
    }),
}));

(global as any).route = vi.fn(() => "/fake-update-url");

// Dummy data
const dummyRekap: Rekap = {
    id: 1,
    status: "dipinjam",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    nomor_tabung: "ABC123",
    tanggal_kembali: null,
    tabung_per_produk: [],
    pesanan: {
        id: 1,
        pelanggan: { nama_pelanggan: "Budi" },
        details: [],
    },
};

describe("Edit Rekap Dialog", () => {
    it("should open dialog, update input, and submit", async () => {
        render(<Edit rekapedit={dummyRekap} />);

        // Buka dialog
        fireEvent.click(screen.getByRole("button"));

        // Tunggu dialog muncul
        expect(await screen.findByText("Edit Rekap")).toBeInTheDocument();

        // Ambil semua textbox (karena <Input> di edit tidak punya id)
        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBeGreaterThan(0);

        const nomorTabungInput = inputs[0]; // urutan pertama adalah nomor_tabung
        fireEvent.change(nomorTabungInput, { target: { value: "XYZ789" } });

        // Submit
        fireEvent.click(screen.getByText("Simpan Perubahan"));

        // Pastikan put dipanggil
        await waitFor(() => {
            expect(putMock).toHaveBeenCalled();
        });
    });
});
