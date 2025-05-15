import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import Deleterkp from "./Delete";
import { Rekap } from "@/types";

// Mock inertia
const deleteMock = vi.fn();
const resetMock = vi.fn();
vi.mock("@inertiajs/react", () => ({
    useForm: () => ({
        delete: deleteMock,
        data: {},
        setData: vi.fn(),
        post: vi.fn(),
        processing: false,
        errors: {},
        reset: resetMock,
    }),
}));

(global as any).route = vi.fn(
    (name: string, id: number) => `/rekap/delete/${id}`
);

// Dummy data
const dummyRekap: Rekap = {
    id: 42,
    status: "keluar",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    nomor_tabung: "DEF456",
    tanggal_kembali: null,
    tabung_per_produk: [],
    pesanan: {
        id: 2,
        pelanggan: { nama_pelanggan: "Andi" },
        details: [],
    },
};

describe("Delete Rekap Dialog", () => {
    it("should open dialog and trigger delete on confirm", async () => {
        render(<Deleterkp rekapdelete={dummyRekap} />);

        // Klik tombol ikon trash
        fireEvent.click(screen.getByRole("button"));

        // Konfirmasi dialog muncul
        expect(
            await screen.findByText(
                "Are you sure you want to delete it permanently?"
            )
        ).toBeInTheDocument();

        // Klik tombol "Continue"
        fireEvent.click(screen.getByText("Continue"));

        // Pastikan delete dipanggil
        await waitFor(() => {
            expect(deleteMock).toHaveBeenCalledWith("/rekap/delete/42", {
                onSuccess: expect.any(Function),
            });
        });
    });
});
