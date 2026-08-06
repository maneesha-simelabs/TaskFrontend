import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

describe("Input", () => {
  it("renders label, required marker, and error text", () => {
    render(
      <Input
        label="Email"
        name="email"
        value="demo@example.com"
        required
        error="Email is invalid"
        placeholder="Enter email"
        onChange={jest.fn()}
      />,
    );

    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveValue("demo@example.com");
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
  });

  it("calls onChange when the user types", async () => {
    const onChange = jest.fn();

    render(<Input label="Name" name="name" value="" onChange={onChange} />);

    const input = screen.getByLabelText(/name/i);
    await userEvent.type(input, "Maneesha");

    expect(onChange).toHaveBeenCalled();
  });
});
