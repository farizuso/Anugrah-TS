// tests/StokLogsColumn.test.tsx
import { describe, it, expect } from "vitest";
import { StokLogsColumns } from "./StokLogsColumn";

describe("StokLogsColumns", () => {
    it("formats tanggal correctly", () => {
        const row = {
            original: {
                tanggal: "2025-05-14T10:30:00Z",
            },
        };
        const tanggalCol = StokLogsColumns.find(
            (col) => col.accessorKey === "tanggal"
        );
        const rendered = tanggalCol?.cell?.({ row });
        expect(rendered.props.children).toContain("2025");
    });

    it("displays product name", () => {
        const row = {
            original: {
                produk: { nama_produk: "Oksigen" },
            },
        };
        const col = StokLogsColumns.find(
            (col) => col.accessorKey === "produk.nama_produk"
        );
        const rendered = col?.cell?.({ row });
        expect(rendered).toBe("Oksigen");
    });

    it("renders tipe with correct class", () => {
        const masukRow = { original: { tipe: "masuk" } };
        const keluarRow = { original: { tipe: "keluar" } };
        const col = StokLogsColumns.find((col) => col.accessorKey === "tipe");

        const masuk = col?.cell?.({ row: masukRow });
        const keluar = col?.cell?.({ row: keluarRow });

        expect(masuk.props.className).toContain("text-green-600");
        expect(keluar.props.className).toContain("text-red-600");
    });

    it("renders jumlah and sisa_stok", () => {
        const row = {
            original: { jumlah: 20, sisa_stok: 100 },
        };
        const jumlahCol = StokLogsColumns.find(
            (col) => col.accessorKey === "jumlah"
        );
        const stokCol = StokLogsColumns.find(
            (col) => col.accessorKey === "sisa_stok"
        );

        const jumlah = jumlahCol?.cell?.({ row });
        const sisa = stokCol?.cell?.({ row });

        expect(jumlah.props.children).toBe(20);
        expect(sisa.props.children).toBe(100);
    });

    it("displays keterangan or fallback", () => {
        const withText = { original: { keterangan: "Retur" } };
        const empty = { original: { keterangan: null } };
        const col = StokLogsColumns.find(
            (col) => col.accessorKey === "keterangan"
        );

        expect(col?.cell?.({ row: withText })).toBe("Retur");
        expect(col?.cell?.({ row: empty })).toBe("-");
    });
});
