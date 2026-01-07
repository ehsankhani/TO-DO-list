import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppProviders } from "../../../app/providers/AppProviders.jsx";
import { TodosPage } from "./TodosPage.jsx";

function renderTodos() {
  window.localStorage.clear();
  return render(
    <AppProviders>
      <TodosPage />
    </AppProviders>,
  );
}

describe("TodosPage flows", () => {
  test("add -> edit -> delete task", async () => {
    const user = userEvent.setup();
    renderTodos();

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, "My first task");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText("My first task")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^edit$/i }));
    const editRegion = screen.getByRole("region", { name: /edit/i });
    const editTitle = within(editRegion).getByLabelText(/title/i);
    await user.clear(editTitle);
    await user.type(editTitle, "Updated task");
    await user.click(within(editRegion).getByRole("button", { name: /save/i }));

    expect(await screen.findByText("Updated task")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    // delete animates out, wait a bit
    expect(await screen.findByText(/nothing here yet/i)).toBeInTheDocument();
  });
});


