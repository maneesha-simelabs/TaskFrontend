jest.mock("../services/axios");
import {
  getTasks,
  getUsers,
  getCategories,
  getMyTasks,
} from "../services/axios";
import { render } from "@testing-library/react";
import { AuthContext } from "../contexts/AuthContext";
import Tasks from "./Tasks";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

getUsers.mockResolvedValue([]);
getCategories.mockResolvedValue([]);

getTasks.mockResolvedValue({
  tasks: [],
  pagination: {
    totalPages: 1,
  },
});

getMyTasks.mockResolvedValue({
  tasks: [],
  pagination: {
    totalPages: 1,
  },
});

function renderWithAuth(ui, user) {
  return render(
    <AuthContext.Provider value={{ user }}> {ui} </AuthContext.Provider>,
  );
}

test("shows loading state initially", () => {
  getTasks.mockImplementation(() => new Promise(() => {}));
  renderWithAuth(<Tasks />, { role: "Admin" });
  expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
});

test("shows empty state when no tasks exist", async () => {
  getTasks.mockResolvedValue({ tasks: [], pagination: { totalPages: 1 } });
  getUsers.mockResolvedValue([]);
  getCategories.mockResolvedValue([]);
  renderWithAuth(<Tasks />, { role: "Admin" });
  expect(await screen.findByText(/no tasks available/i)).toBeInTheDocument();
});

test("renders tasks from API", async () => {
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

  getUsers.mockResolvedValue([]);
  getCategories.mockResolvedValue([]);

  renderWithAuth(<Tasks />, { role: "Admin" });

  expect(await screen.findByText("Learn React Testing")).toBeInTheDocument();

  expect(screen.getByText("Practice RTL")).toBeInTheDocument();

  expect(screen.getByText(/status: pending/i)).toBeInTheDocument();
});

test("shows Add Task button for admin", async () => {
  getTasks.mockResolvedValue({ tasks: [], pagination: { totalPages: 1 } });
  getUsers.mockResolvedValue([]);
  getCategories.mockResolvedValue([]);
  renderWithAuth(<Tasks />, { role: "Admin" });
  expect(
    await screen.findByRole("button", { name: /add task/i }),
  ).toBeInTheDocument();
});

test("does not show Add Task button for normal user", async () => {
  getMyTasks.mockResolvedValue([]);
  renderWithAuth(<Tasks />, { role: "User" });
  expect(
    screen.queryByRole("button", { name: /add task/i }),
  ).not.toBeInTheDocument();
});

jest.mock(
  "../components/TaskModal",
  () => (props) => (props.isOpen ? <div>Task Modal Open</div> : null),
);

test("opens modal when Add Task is clicked", async () => {
  getTasks.mockResolvedValue({
    tasks: [],
    pagination: { totalPages: 1 },
  });

  getUsers.mockResolvedValue([]);
  getCategories.mockResolvedValue([]);

  renderWithAuth(<Tasks />, { role: "Admin" });

  const button = await screen.findByRole("button", { name: /add task/i });

  await userEvent.click(button);

  expect(screen.getByText("Task Modal Open")).toBeInTheDocument();
});

test("shows error message when API fails", async () => {
  getTasks.mockRejectedValue(new Error("Network Error"));
  getUsers.mockResolvedValue([]);
  getCategories.mockResolvedValue([]);
  renderWithAuth(<Tasks />, { role: "Admin" });
  expect(
    await screen.findByText(/unable to load tasks right now/i),
  ).toBeInTheDocument();
});
