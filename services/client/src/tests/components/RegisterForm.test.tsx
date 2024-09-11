import React from "react";
import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import RegisterForm from "../../components/RegisterForm";

it("RegisterForm renders without crashing", () => {
  render(<RegisterForm onSubmit={() => {}} />);

  expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
});

it("RegisterForm renders properly", () => {
  const { asFragment } = render(<RegisterForm onSubmit={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});
