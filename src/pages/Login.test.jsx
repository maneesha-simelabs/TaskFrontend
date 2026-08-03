import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import Button from "../components/Button";
import { AuthProvider } from "../contexts/AuthContext";
import userEvent from "@testing-library/user-event";

test("renders login form", () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>,
  );

  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});

test("user types email", async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>,
  );

  const email = screen.getByPlaceholderText(/email/i);

  await userEvent.type(email, "abc@gmail.com");

  expect(email).toHaveValue("abc@gmail.com");
});

test("button clicks", async () => {
  const login = jest.fn();

  render(<Button onClick={login}>Login</Button>);

  const button = screen.getByRole("button", { name: /login/i });

  await userEvent.click(button);

  expect(login).toHaveBeenCalledTimes(1);
});
