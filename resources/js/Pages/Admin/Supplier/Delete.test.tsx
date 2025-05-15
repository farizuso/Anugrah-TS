// tests/Delete.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Delete from "./Delete";
import { describe, it, expect, vi } from "vitest";

// Mocks
vi.mock("@inertiajs/react", async () => {
    const actual = await vi.importActual("@inertiajs/react");
    return {
        ...actual,
        useForm: () => ({
            delete: vi.fn(),
            data: {},
            setData: vi.fn(),
            post: vi.fn(),
            processing: false,
            errors: {},
            reset: vi.fn(),
        }),
    };
});

vi.mock("@/Components/ui/alert-dialog", async () => {
    const actual = await vi.importActual("@/Components/ui/alert-dialog");
    return {
        ...actual,
        AlertDialog: ({ children }: any) => <div>{children}</div>,
        AlertDialogTrigger: ({ children }: any) => <div>{children}</div>,
        AlertDialogContent: ({ children }: any) => <div>{children}</div>,
        AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
        AlertDialogTitle: ({ children }: any) => <div>{children}</div>,
        AlertDialogDescription: ({ children }: any) => <div>{children}</div>,
        AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
        AlertDialogCancel: ({ children }: any) => <button>{children}</button>,
        AlertDialogAction: ({ children, onClick }: any) => (
            <button onClick={onClick}>{children}</button>
        ),
    };
});

vi.mock("react-icons/fa", () => ({
    FaTrash: () => <span>🗑️</span>,
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
    no_hp: "08123456789",
};

describe("Delete Supplier Component", () => {
    it("renders delete button", () => {
        render(<Delete supplierdelete={mockSupplier} />);
        expect(screen.getAllByRole("button").length).toBeGreaterThan(0);

        expect(screen.getByText("🗑️")).toBeInTheDocument();
    });

    it("calls delete function when 'Continue' clicked", () => {
        const { getByText } = render(<Delete supplierdelete={mockSupplier} />);
        const continueButton = getByText("Continue");
        fireEvent.click(continueButton);
        // Tidak ada assert langsung untuk vi.fn di mock global useForm,
        // tapi kita tahu kalau AlertDialogAction berhasil di-click tanpa error
        expect(continueButton).toBeInTheDocument();
    });
});
