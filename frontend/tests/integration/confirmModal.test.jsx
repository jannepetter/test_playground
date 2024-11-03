import ConfirmModal from "@/components/ConfirmModal";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";

const onConfirm = jest.fn();
const RenderWithState = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => setIsOpen(false);
  return <ConfirmModal isOpen={isOpen} onClose={handleClose} onConfirm={onConfirm} />;
};

describe("Confirm modal component", () => {
  it("Confirm modal not visible by default", () => {
    render(<ConfirmModal title="test" content="test content" isOpen={false} />);
    const dialogNotVisible = screen.queryByRole("dialog");
    expect(dialogNotVisible).toBeNull();
  });

  it("Opened modal can be closed with cancel btn", () => {
    render(<RenderWithState />);
    const dialog = screen.queryByRole("dialog");
    expect(dialog).toBeVisible();
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);
    const closedDialog = screen.queryByRole("dialog");
    expect(closedDialog).toBeNull();
  });

  it("Opened modal can be closed with corner btn", () => {
    render(<RenderWithState />);
    const dialog = screen.queryByRole("dialog");
    expect(dialog).toBeVisible();
    const xBtn = screen.getByRole("button", { name: "X" });
    fireEvent.click(xBtn);
    const closedDialog = screen.queryByRole("dialog");
    expect(closedDialog).toBeNull();
  });

  it("Opened modal closes with confirm btn", () => {
    render(<RenderWithState />);
    const dialog = screen.queryByRole("dialog");
    expect(dialog).toBeVisible();
    const confirmBtn = screen.getByRole("button", { name: "Confirm" });
    fireEvent.click(confirmBtn);
    const closedDialog = screen.queryByRole("dialog");
    expect(closedDialog).toBeNull();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
