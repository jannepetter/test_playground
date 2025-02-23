import Navigation from "@/components/Navigation";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { UserProvider } from "@/context/user";

const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      removeItem(key) {
        delete store[key];
      },
      clear() {
        store = {};
      },
    };
  })();

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));


describe("Test Navbar", () => {
  it("Navbar visible", async () => {
    render(
      <UserProvider>
        <Navigation />
      </UserProvider>,
    );
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();
    expect(screen.getByText("The app")).toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();

  });
  it("Navbar visible2", async () => {
    window.localStorage.setItem("username","user")
    window.localStorage.setItem("id","1")
    render(
      <UserProvider>
        <Navigation />
      </UserProvider>,
    );
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Blogs")).toBeInTheDocument();
    expect(screen.getByText("Create blog")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("handles logout correctly",async () => {
    window.localStorage.setItem("username","user")
    window.localStorage.setItem("id","1")

    render(
      <UserProvider>
        <Navigation />
      </UserProvider>,
    );

    expect(mockLocalStorage.getItem('username')).toBe("user");

    fireEvent.click(screen.getByText("Logout"));
    expect(screen.getByText("The app")).toBeInTheDocument();
    expect(mockLocalStorage.getItem('username')).toBe(null);
  });
});
