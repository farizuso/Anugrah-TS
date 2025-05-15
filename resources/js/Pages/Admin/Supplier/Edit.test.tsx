// tests/Edit.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Edit from "./Edit";
import { describe, it, expect, vi } from "vitest";

vi.mock("@inertiajs/react", async () => {
    const actual = await vi.importActual("@inertiajs/react");
    return {
        ...actual,
        useForm: () => ({
            put: mockPut,
            data: {},
            setData: vi.fn(),
            processing: false,
            errors: {},
        }),
    };
});

const mockPut = vi.fn((url, { onSuccess }: any) => {
    if (onSuccess) onSuccess(); // simulasi berhasil dan menutup dialog
});

vi.mock("react-icons/bs", () => ({
    BsPencilSquare: () => <span>✏️</span>,
}));

vi.mock("@/Components/ui/button", () => ({
    Button: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}));

const mockSupplier = {
    id: 123,
    nama_supplier: "PT. Gas Kita",
    alamat: "Jl. Gas No. 1",
    no_telp: "08123456789",
};

describe("Edit Supplier Component", () => {
    it("renders edit button", () => {
        render(<Edit supplieredit={mockSupplier} />);
        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByText("✏️")).toBeInTheDocument();
    });

    it("opens dialog when edit button is clicked", () => {
        render(<Edit supplieredit={mockSupplier} />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Edit Data Supplier")).toBeInTheDocument();
    });

    it("submits the form with updated data", async () => {
        const { getByLabelText, getByText } = render(
            <Edit supplieredit={mockSupplier} />
        );
        fireEvent.click(screen.getByRole("button"));

        fireEvent.change(getByLabelText("Nama Supplier"), {
            target: { value: "PT. Gas Baru" },
        });
        fireEvent.change(getByLabelText("Alamat"), {
            target: { value: "Jl. Baru No. 99" },
        });
        fireEvent.change(getByLabelText("No Telp"), {
            target: { value: "08199887766" },
        });

        fireEvent.click(getByText("Save changes"));

        await waitFor(() => {
            expect(
                screen.queryByText("Edit Data Supplier")
            ).not.toBeInTheDocument();
        });
    });
});
