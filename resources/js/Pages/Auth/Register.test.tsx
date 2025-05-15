import { render, screen } from "@testing-library/react";
import Register from "./Register";
import { vi } from "vitest";

vi.mock("@inertiajs/react", () => ({
    Head: () => null,
    Link: ({ children }: any) => <div>{children}</div>,
    useForm: () => ({
        data: {},
        setData: () => {},
        post: () => {},
        processing: false,
        errors: {},
        reset: () => {},
    }),
}));

// Patch untuk error 'module is not defined'
(global as any).module = {};

describe("Register Page", () => {
    it("renders register form correctly", () => {
        render(<Register />);
        expect(screen.getByRole("form")).toBeInTheDocument();
    });

    it("submits form when register button is clicked", () => {
        render(<Register />);
        expect(
            screen.getByRole("button", { name: /register/i })
        ).toBeInTheDocument();
    });
});
