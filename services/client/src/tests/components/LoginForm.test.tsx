import React from "react";
import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import LoginForm from "../../components/LoginForm";

it("LoginForm renders without crashing", () => {
  render(<LoginForm onSubmit={() => {}} />);

  expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
});

it("LoginForm renders properly", () => {
  const { asFragment } = render(<LoginForm onSubmit={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});
