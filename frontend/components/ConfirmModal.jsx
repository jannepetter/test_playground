import React from "react";

const ConfirmModal = ({ title, content, onConfirm, isOpen, onClose, testId = "confirm-modal" }) => {
  return (
    <>
      <dialog className="modal bg-gray-500 bg-opacity-50" open={isOpen} data-testid={testId}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{content}</p>
          <div className="modal-action flex justify-end" name="modal-action-buttons">
            <button
              className="btn btn-sm btn-ghost absolute right-2 top-2"
              onClick={() => onClose()}
            >
              X
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirm
            </button>
            <button className="btn" onClick={() => onClose()}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ConfirmModal;
