// tests/rekapColumn.test.tsx
import { describe, it, expect } from "vitest";
import { rekapColumns } from "./rekapColumn";

describe("rekapColumns", () => {
    it("should contain Pelanggan column", () => {
        const column = rekapColumns.find(
            (col) => col.accessorKey === "pelanggan"
        );
        expect(column).toBeDefined();
        const row = {
            original: {
                pesanan: {
                    pelanggan: {
                        nama_pelanggan: "Siti",
                    },
                },
            },
        };
        const rendered = column?.cell?.({ row });
        expect(rendered).toEqual("Siti");
    });

    it("should render formatted Tgl. Keluar", () => {
        const column = rekapColumns.find(
            (col) => col.accessorKey === "tanggal_keluar"
        );
        expect(column).toBeDefined();
        const row = {
            original: {
                pesanan: {
                    tgl_pesanan: "2025-05-01",
                },
            },
        };
        const cell = column?.cell?.({ row });
        expect(cell?.props?.children).toContain("2025");
    });

    it("should render status with badge class", () => {
        const column = rekapColumns.find((col) => col.accessorKey === "status");
        expect(column).toBeDefined();
        const row = { original: { status: "kembali" } };
        const badge = column?.cell?.({ row });
        expect(badge.props.className).toContain("bg-green-500");
    });
});
