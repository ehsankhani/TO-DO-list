import React from "react";
import { AppShell } from "./components/AppShell.jsx";
import { TodosPage } from "../features/todos/components/TodosPage.jsx";

export function App() {
  return (
    <AppShell>
      <TodosPage />
    </AppShell>
  );
}


