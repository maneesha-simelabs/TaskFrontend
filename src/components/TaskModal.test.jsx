import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskModal from "./TaskModal";

describe("TaskModal", () => {
  test("task modal validation", async () => {
    render(
      <TaskModal
        isOpen={true}
        users={[]}
        categories={[]}
        onClose={jest.fn()}
        onSave={jest.fn()}
        initialData={null}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(screen.getByText(/please fill required fields/i)).toBeInTheDocument();
  });

  test("create task calls onSave", async () => {
    const onSave = jest.fn();

    render(
      <TaskModal
        isOpen={true}
        users={[{ _id: "user-1", name: "Alex" }]}
        categories={[{ _id: "cat-1", name: "Work" }]}
        onClose={jest.fn()}
        onSave={onSave}
        initialData={null}
      />,
    );

    await userEvent.type(screen.getByLabelText(/title/i), "New Task");
    await userEvent.type(screen.getByLabelText(/description/i), "Task body");
    await userEvent.type(screen.getByLabelText(/duedate/i), "2026-08-10");
    await userEvent.selectOptions(screen.getByLabelText(/priority/i), "High");
    await userEvent.selectOptions(screen.getByLabelText(/status/i), "Todo");
    await userEvent.selectOptions(screen.getByLabelText(/assign to/i), "user-1");
    await userEvent.selectOptions(screen.getByLabelText(/category/i), "cat-1");
    await userEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(onSave).toHaveBeenCalled();
  });
});
