import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

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

describe("Home", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("renders the hero content and navigates to tasks when auth is ready", async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ authReady: true }}>
          <Home />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/manage your work/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /tasks/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/tasks");
  });

  it("navigates to login when auth is not ready", async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ authReady: false }}>
          <Home />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
