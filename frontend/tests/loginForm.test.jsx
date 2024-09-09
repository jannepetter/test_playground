import LoginForm from "@/components/LoginForm";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { UserProvider } from "@/context/user";
import { login } from "@/api/users";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../api/users", () => ({
  login: jest.fn(),
}));

jest.mock("../utils/storage", () => ({
  saveUserToLocalStorage: jest.fn(),
}));

describe("Login form", () => {
  it("Login form visible and working", async () => {
    render(
      <UserProvider>
        <LoginForm />
      </UserProvider>,
    );
    const loginForm = screen.getByTestId("login-form");
    expect(loginForm).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("username")).toBeInTheDocument();
    expect(screen.getByText("password")).toBeInTheDocument();

    const usernameInput = screen.getByTestId("login-username");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    const passwordInput = screen.getByTestId("login-password");
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    const submitButton = screen.getByRole("button", { name: "Submit" });

    const mockLogin = jest.fn();
    login.mockImplementation(mockLogin);
    mockLogin.mockReturnValue({ data: { user: { username: "testuser" } } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1);
      expect(login).toHaveBeenCalledWith("testuser", "testpassword");
    });
  });
});
