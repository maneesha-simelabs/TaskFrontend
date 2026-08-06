import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  it("renders a button with the default type and handles clicks", async () => {
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveAttribute("type", "button");

    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a disabled button", async () => {
    const onClick = jest.fn();

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();

    await userEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });
});
