import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/Modal.css";

// TUTORIAL: https://upmostly.com/tutorials/modal-components-react-custom-hooks

export default function Modal({
  isShowing,
  className,
  auto = false,
  closeable = true,
  screen = true,
  children,
}) {
  const [active, setActive] = useState(false);
  const wrapper = useRef();

  // console.log({ isShowing });
  console.log({ children });
  useEffect(() => isShowing && setActive(true), []);

  const closeModal = e => {
    document.body.classList.toggle("modal-lock");
    setActive(false);
  };

  return isShowing
    ? createPortal(
        <>
          <div className={`modal-overlay ${screen ? "screen" : "clear"}`} />
          <div
            className={`modal-wrapper flex col ${
              active ? "active" : ""
            } ${className}`}
            ref={wrapper}
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal flex col center">
              {!auto && closeable && (
                <div
                  className="modal-close flex center"
                  data-dismiss="modal"
                  aria-label="close"
                  onClick={() => !auto && closeModal()}
                />
              )}
              {children}
            </div>
          </div>
        </>,
        document.body
      )
    : null;
}
