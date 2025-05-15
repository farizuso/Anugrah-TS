import { render, screen } from "@testing-library/react";
import Detail from "./Detail";
import { describe, it, expect, vi } from "vitest";

// Mocks
vi.mock("@/Layouts/AdminLayout", () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@inertiajs/react", async () => {
    const actual = await vi.importActual("@inertiajs/react");
    return {
        ...actual,
        usePage: () => ({ props: {} }),
    };
});

const mockPesanan = {
    id: 1,
    tgl_pesanan: "2025-05-01",
    metode_pembayaran: "Transfer",
    keterangan: "Lunas",
    status: "Dikirim",
    total: 150000,
    jumlah_terbayar: 150000,
    jenis_pesanan: "beli",
    pelanggan: {
        nama_pelanggan: "Budi",
        alamat: "Jl. Mawar",
        no_hp: "08123456789",
    },
    details: [
        {
            produk: { nama_produk: "Oksigen" },
            quantity: 2,
            harga: 50000,
        },
    ],
    riwayat_pembayaran: [],
};

describe("Detail Component", () => {
    it("renders order detail correctly", () => {
        render(<Detail pesanan={mockPesanan} />);
        expect(screen.getByText("Detail Transaksi")).toBeInTheDocument();
        expect(
            screen.getByText((text) => text.includes("# 1"))
        ).toBeInTheDocument();

        expect(screen.getByText("Budi")).toBeInTheDocument();
        expect(screen.getByText("Oksigen")).toBeInTheDocument();
        expect(
            screen.getByText((text) => /Rp.?150\.000/.test(text))
        ).toBeInTheDocument();
    });
});
