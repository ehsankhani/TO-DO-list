import React from "react";
import { Header } from "./Header.jsx";

export function AppShell({ children }) {
  return (
    <div>
      <Header />
      <main className="container">
        <div className="surface" style={{ padding: "var(--sp-6)" }}>
          {children}
        </div>
      </main>
    </div>
  );
}


