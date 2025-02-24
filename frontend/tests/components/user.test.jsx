import React from "react";
import "@testing-library/jest-dom";
import { render, screen, within, waitFor } from "@testing-library/react";
import { getUsers } from "@/api/users";
import UserList from "@/components/user/UserList";

jest.mock("../../api/users", () => ({
  getUsers: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    toString: jest.fn(),
  }),
}));

const users = [
  {
    id: 1,
    username: "user1",
    email: "email@email.co",
  },
  {
    id: 2,
    username: "user2",
    email: "email2@email.co",
  },
];

describe("Blog components", () => {
  it("Userlist renders a list of users", async () => {
    getUsers.mockResolvedValue({
      data: {
        count: 2,
        next: null,
        previous: null,
        results: users,
      },
    });
    render(<UserList />);
    await waitFor(() => {
      const list = screen.getByRole("list");
      const items = within(list).getAllByRole("listitem");
      expect(items).toHaveLength(2);
      expect(screen.getByText("email@email.co")).toBeInTheDocument();
      expect(screen.getByText("email2@email.co")).toBeInTheDocument();
    });
  });

  it("No userlist available", async () => {
    const err = {
      response: {
        status: 401,
        data: {
          detail: "Given token not valid for any token type",
        },
      },
    };
    getUsers.mockRejectedValue(err);
    render(<UserList />);
    await waitFor(() => {
      const list = screen.getByRole("list");
      const items = within(list).queryAllByRole("listitem");
      expect(items).toHaveLength(0);
    });
  });

  it("No userlist available2", async () => {
    const err = {
      response: {
        status: 403,
        data: {
          detail: "Not authorized",
        },
      },
    };
    getUsers.mockRejectedValue(err);
    render(<UserList />);
    await waitFor(() => {
      const list = screen.getByRole("list");
      const items = within(list).queryAllByRole("listitem");
      expect(items).toHaveLength(0);
    });
  });
});
