import { render, screen } from "@testing-library/react";
import TaskModal from "./TaskModal";

test("renders modal when isOpen is true", () => {
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

  expect(screen.getByText(/add task/i)).toBeInTheDocument();
});

test("does not render when closed", () => {
  render(
    <TaskModal
      isOpen={false}
      users={[]}
      categories={[]}
      onClose={jest.fn()}
      onSave={jest.fn()}
      initialData={null}
    />,
  );

  expect(screen.queryByText(/add task/i)).not.toBeInTheDocument();
});

import userEvent from "@testing-library/user-event";

test("calls onClose when Cancel is clicked", async () => {
  const onClose = jest.fn();

  render(
    <TaskModal
      isOpen={true}
      users={[]}
      categories={[]}
      onClose={onClose}
      onSave={jest.fn()}
      initialData={null}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

  expect(onClose).toHaveBeenCalledTimes(1);
});
test("calls onClose when X is clicked", async () => {
  const onClose = jest.fn();

  render(
    <TaskModal
      isOpen={true}
      users={[]}
      categories={[]}
      onClose={onClose}
      onSave={jest.fn()}
      initialData={null}
    />,
  );

  const buttons = screen.getAllByRole("button");

  await userEvent.click(buttons[0]);

  expect(onClose).toHaveBeenCalled();
});
test("shows validation message when Create is clicked with empty form", async () => {
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
