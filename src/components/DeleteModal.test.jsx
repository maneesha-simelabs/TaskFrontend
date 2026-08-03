import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteModal from "./DeleteModal";

describe("DeleteModal", () => {
  test("confirm action calls onConfirm", async () => {
    const onConfirm = jest.fn();

    render(
      <DeleteModal
        isDeleteModalOpen={true}
        onClose={jest.fn()}
        onConfirm={onConfirm}
        taskTitle="Demo task"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
