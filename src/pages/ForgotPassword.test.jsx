import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import { forgotPassword } from "../services/axios";

jest.mock("../services/axios", () => ({
  forgotPassword: jest.fn(),
}));

describe("ForgotPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows validation when email is empty", async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it("submits a valid email and displays success", async () => {
    forgotPassword.mockResolvedValue({ message: "Reset link sent" });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByPlaceholderText(/enter email/i), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText(/reset link sent/i)).toBeInTheDocument();
  });
});
