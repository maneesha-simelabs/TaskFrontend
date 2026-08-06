import { render, screen } from "@testing-library/react";
import Card from "./Card";

describe("Card", () => {
  it("renders the title, content, and actions", () => {
    render(
      <Card
        title="Profile"
        className="custom-card"
        actions={[<button key="save">Save</button>]}
      >
        Card details
      </Card>,
    );

    const article = screen.getByRole("article", { name: /profile/i });
    expect(article).toHaveClass("custom-card");
    expect(screen.getByText(/card details/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});
