import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ open, children, onClose }) => {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;

    if (open) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [open]);

  return createPortal(
    <dialog
      className="modal"
      ref={dialog}
      onClose={onClose}
      onCancel={onClose}
    >
      {children}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;