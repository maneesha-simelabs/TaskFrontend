import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the header placeholder text", () => {
    render(<Header />);

    expect(screen.getByText(/header/i)).toBeInTheDocument();
  });
});
