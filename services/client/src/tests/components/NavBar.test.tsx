import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

import NavBar from "../../components/NavBar";

it("NavBar renders without crashing", () => {
  render(
    <Router>
      <NavBar title="Hello, World!" />
    </Router>,
  );

  const titleElement = screen.getByText("Hello, World!");
  expect(titleElement).toBeInTheDocument();
  expect(titleElement.closest("h1")).toHaveClass("navbar-item");
  expect(titleElement.closest("h1")).toHaveClass("nav-title");
});

it("NavBar contains correct navigation links", () => {
  render(
    <Router>
      <NavBar title="Test Title" />
    </Router>,
  );

  const links = [
    { text: "User Status", href: "/status" },
    { text: "About", href: "/about" },
    { text: "Register", href: "/register" },
    { text: "Log In", href: "/login" },
    { text: "Log Out", href: "/logout" },
  ];

  links.forEach((link) => {
    const linkElements = screen.getAllByRole("link", { name: link.text });
    expect(linkElements.length).toBeGreaterThan(0);
    expect(linkElements[0]).toHaveAttribute("href", link.href);
  });
});

it("NavBar renders properly", () => {
  const { asFragment } = render(
    <Router>
      <NavBar title="Test Title" />
    </Router>,
  );
  expect(asFragment()).toMatchSnapshot();
});
