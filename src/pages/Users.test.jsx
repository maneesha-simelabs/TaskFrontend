import { render, screen } from "@testing-library/react";
import Users from "./Users";
import { getUsers } from "../services/axios";

jest.mock("../services/axios", () => ({
  getUsers: jest.fn(),
}));

describe("Users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a list of users", async () => {
    getUsers.mockResolvedValue([
      { _id: "1", name: "Maneesha", email: "maneesha@example.com", role: "Admin" },
      { _id: "2", name: "Jane", email: "jane@example.com", role: "User" },
    ]);

    render(<Users />);

    expect(await screen.findByRole("heading", { name: /maneesha/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /jane/i })).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });
});
