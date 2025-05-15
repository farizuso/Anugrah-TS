import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Index";

// ✅ Mock @inertiajs/react
vi.mock("@inertiajs/react", async () => {
    const actual = await vi.importActual("@inertiajs/react");
    return {
        ...actual,
        usePage: () => ({
            props: {
                auth: { user: { name: "Test User" } },
                totalRevenue: 5000000,
                totalPurchases: 30,
                totalSales: 25,
                totalStock: 100,
                recentSales: [
                    {
                        name: "Pelanggan A",
                        phone: "08123456789",
                        totalAmount: "Rp500.000",
                    },
                ],
                monthlySales: [{ month: "Jan", sales: 10 }],
                lowStockProducts: [{ nama: "Produk X", stok: 5 }],
            },
        }),
        Head: () => <></>, // Mock Head agar tidak menyebabkan error
    };
});

// ✅ Mock global route() untuk menghindari error "route(...).current is not a function"
beforeAll(() => {
    global.route = vi.fn(() => ({
        current: vi.fn((name: string) => name === "admin.dashboard.index"),
    }));

    // Mock ResizeObserver untuk mencegah error saat rendering grafik
    class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    (global as any).ResizeObserver = ResizeObserver;
});

describe("Dashboard Component", () => {
    it("renders without crashing", () => {
        render(<Dashboard />);
    });

    it("renders all card components with correct data", () => {
        render(<Dashboard />);

        expect(screen.getByText("Total Pendapatan")).toBeInTheDocument();
        expect(screen.getByText(/Rp\s?5.000.000/i)).toBeInTheDocument(); // ✅ Perbaikan di sini!
        expect(screen.getByText("Pembelian")).toBeInTheDocument();
        expect(screen.getByText("30")).toBeInTheDocument();
        expect(screen.getByText("Penjualan")).toBeInTheDocument();
        expect(screen.getByText("25")).toBeInTheDocument();
        expect(screen.getByText("Total Stok")).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("renders low stock products", () => {
        render(<Dashboard />);
        expect(screen.getByText("Produk X")).toBeInTheDocument();
        expect(
            screen.getByText((content) => content.includes("Sisa: 5"))
        ).toBeInTheDocument();
    });

    it("renders recent sales", () => {
        render(<Dashboard />);
        expect(screen.getByText("Pelanggan Terbaik")).toBeInTheDocument();
        expect(screen.getByText("Pelanggan A")).toBeInTheDocument();
        expect(screen.getByText(/08123456789/i)).toBeInTheDocument();
        expect(
            screen.getByText((content) => content.includes("Rp500.000"))
        ).toBeInTheDocument();
    });
});
