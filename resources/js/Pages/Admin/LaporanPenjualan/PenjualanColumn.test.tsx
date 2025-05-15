import { describe, it, expect } from "vitest";
import { PenjualanColumns } from "./PenjualanColumn";

describe("PenjualanColumns", () => {
    it("should contain Total Tagihan column with currency formatting", () => {
        const column = PenjualanColumns.find(
            (col) => col.header === "Total Tagihan"
        );
        expect(column).toBeDefined();
        expect(typeof column?.cell).toBe("function");

        // Simulasikan baris
        const mockRow = {
            original: { total: 250000 },
        };
        const cellContent = column?.cell?.({ row: mockRow });
        expect(cellContent.props.children).toContain("Rp");
    });
});
