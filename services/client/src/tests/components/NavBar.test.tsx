import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, it, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

import NavBar from "../../components/NavBar";

describe("NavBar", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockLogoutUser = vi.fn();

  it("NavBar renders without crashing", () => {
    render(
      <Router>
        <NavBar
          title="Hello, World!"
          logoutUser={mockLogoutUser}
          isAuthenticated={() => false}
        />
      </Router>,
    );

    const titleElement = screen.getByText("Hello, World!");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.closest("h1")).toHaveClass("navbar-item");
    expect(titleElement.closest("h1")).toHaveClass("nav-title");
  });

  it("NavBar contains correct navigation links when user is logged out", () => {
    render(
      <Router>
        <NavBar
          title="Hello, World!"
          logoutUser={mockLogoutUser}
          isAuthenticated={() => false}
        />
      </Router>,
    );

    // Links that should be visible when logged out
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log In" })).toBeInTheDocument();

    // Links that should be hidden when logged out
    expect(
      screen.queryByRole("link", { name: "User Status" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Log Out")).not.toBeInTheDocument();
  });

  it("NavBar contains correct navigation links when user is logged in", () => {
    render(
      <Router>
        <NavBar
          title="Hello, World!"
          logoutUser={mockLogoutUser}
          isAuthenticated={() => true}
        />
      </Router>,
    );

    // Links that should be visible when logged in
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "User Status" }),
    ).toBeInTheDocument();

    // Check for Log Out link
    const logOutLinks = screen.getAllByText("Log Out");
    expect(logOutLinks.length).toBeGreaterThan(0);
    expect(logOutLinks[0]).toBeInTheDocument();

    // Links that should be hidden when logged in
    expect(
      screen.queryByRole("link", { name: "Register" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Log In" }),
    ).not.toBeInTheDocument();
  });

  it("NavBar renders properly", () => {
    const { asFragment } = render(
      <Router>
        <NavBar
          title="Hello, World!"
          logoutUser={mockLogoutUser}
          isAuthenticated={() => false}
        />
      </Router>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
