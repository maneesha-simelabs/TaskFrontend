import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import { resetPassword } from "../services/axios";

jest.mock("../services/axios", () => ({
  resetPassword: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ResetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  it("shows validation errors for weak or mismatched passwords", async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/new password/i), "short");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "different");
    await userEvent.click(screen.getByRole("button", { name: /reset password/i }));

    expect(await screen.findByText(/password must contain at least 8 characters/i)).toBeInTheDocument();
  });

  it("submits a valid password and navigates to login", async () => {
    resetPassword.mockResolvedValue({});

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/new password/i), "Strong123");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "Strong123");
    await userEvent.click(screen.getByRole("button", { name: /reset password/i }));

    expect(resetPassword).toHaveBeenCalledWith("", "Strong123");
    expect(window.alert).toHaveBeenCalledWith("Password changed successfully");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
