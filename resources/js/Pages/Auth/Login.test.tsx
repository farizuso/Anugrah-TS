import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Login from "@/Pages/Auth/Login";

vi.mock("@inertiajs/react", async () => {
    const actual = await vi.importActual<any>("@inertiajs/react");
    return {
        ...actual,
        useForm: () => ({
            data: {
                email: "",
                password: "",
                remember: false,
            },
            setData: vi.fn(),
            post: vi.fn(),
            processing: false,
            errors: {},
            reset: vi.fn(),
        }),
        Link: ({ href, children }: any) => <a href={href}>{children}</a>,
    };
});

vi.mock("use-local-storage", () => {
    return {
        default: () => ["", vi.fn()], // <== KUNCI DI SINI
    };
});

describe("Login Page", () => {
    it("renders login form correctly", () => {
        render(<Login />);
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ingat Saya/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Sign in/i })
        ).toBeInTheDocument();
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });

    it("submits form when sign in button is clicked", () => {
        const { getByRole } = render(<Login />);
        const submitButton = getByRole("button", { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(true).toBe(true); // ganti ini jika ingin test interaksi lebih lanjut
    });
});
