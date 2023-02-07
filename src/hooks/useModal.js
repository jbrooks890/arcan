import { useState } from "react";
import ReactDOM, { createPortal } from "react-dom";
import Modal from "../components/shared/Modal";

// TUTORIAL: https://upmostly.com/tutorials/modal-components-react-custom-hooks

export default function useModal() {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => setIsShowing(prev => !prev);

  const close = () => isShowing && setIsShowing(false);

  const modal = (content, className, auto) => {
    console.log({ content });
    // return <Modal {...{ isShowing: true, className, auto }}>{content}</Modal>;
    return (
      <Modal
        isShowing={isShowing}
        className={className}
        auto={auto}
        closeable={false}
      >
        {content}
      </Modal>
    );
  };

  return {
    isShowing,
    close,
    toggle,
    modal,
  };
}
