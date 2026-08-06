import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Tasks from "./Tasks";
import { AuthContext } from "../contexts/AuthContext";
import {
  getTasks,
  getUsers,
  getCategories,
  getMyTasks,
} from "../services/axios";

jest.mock("../services/axios", () => ({
  getTasks: jest.fn(),
  getUsers: jest.fn(),
  getCategories: jest.fn(),
  getMyTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

function renderWithAuth(ui, user) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user }}>{ui}</AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("Tasks page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUsers.mockResolvedValue([]);
    getCategories.mockResolvedValue([]);
    getTasks.mockResolvedValue({ tasks: [], pagination: { totalPages: 1 } });
    getMyTasks.mockResolvedValue([]);
  });

  test("tasks loading state", () => {
    getTasks.mockImplementation(() => new Promise(() => {}));

    renderWithAuth(<Tasks />, { role: "Admin" });

    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  test("tasks empty state", async () => {
    renderWithAuth(<Tasks />, { role: "Admin" });

    expect(await screen.findByText(/no tasks available/i)).toBeInTheDocument();
  });

  test("tasks list renders", async () => {
    getTasks.mockResolvedValue({
      tasks: [
        {
          _id: "1",
          title: "Learn React Testing",
          description: "Practice RTL",
          status: "Pending",
          priority: "High",
          dueDate: "2026-08-10",
          category: { name: "Learning" },
          assignedTo: { name: "Maneesha" },
        },
      ],
      pagination: { totalPages: 1 },
    });

    renderWithAuth(<Tasks />, { role: "Admin" });

    expect(await screen.findByText(/learn react testing/i)).toBeInTheDocument();
    expect(screen.getByText(/practice rtl/i)).toBeInTheDocument();
  });

  test("add task modal opens", async () => {
    renderWithAuth(<Tasks />, { role: "Admin" });

    await userEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByLabelText(/title/i)).toBeInTheDocument();
  });
});
