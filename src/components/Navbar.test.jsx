import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./Navbar";

jest.mock("../contexts/AuthContext", () => {
  const React = require("react");
  return {
    AuthContext: React.createContext(null),
  };
});

import { AuthContext } from "../contexts/AuthContext";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NavBar", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("shows the admin-only link for admins and logs out", async () => {
    const logout = jest.fn();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { data: { user: { role: "Admin" } } }, logout }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /users/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("link", { name: /logout/i }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/Login");
  });

  it("hides the users link for non-admins", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { data: { user: { role: "User" } } }, logout: jest.fn() }}>
          <NavBar />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.queryByRole("link", { name: /users/i })).not.toBeInTheDocument();
  });
});
