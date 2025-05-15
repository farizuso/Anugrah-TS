import { describe, it, expect } from "vitest";
import { produkColumns } from "./produkColumn";

describe("produkColumns configuration", () => {
    it("includes expected columns", () => {
        const headers = produkColumns.map((col) => col.id || col.accessorKey);
        expect(headers).toContain("nama_produk");
        expect(headers).toContain("simbol");
        expect(headers).toContain("kategori");
        expect(headers).toContain("jumlah_stok");
        expect(headers).toContain("harga_jual");
        expect(headers).toContain("actions");
    });

    it("formats harga_jual as currency", () => {
        const hargaCol = produkColumns.find(
            (col) => col.accessorKey === "harga_jual"
        );
        const rowMock = { getValue: () => "150000" };

        const result = hargaCol?.cell?.({ row: rowMock } as any);
        expect(result?.props.children).toContain("Rp");
    });
});
