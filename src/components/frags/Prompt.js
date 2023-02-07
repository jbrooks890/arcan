import "../../styles/Prompt.css";
import useModal from "../../hooks/useModal";
import FieldSet from "../form/FieldSet";
import Menu from "../form/Menu";

export default function Prompt({
  btnTxt,
  message,
  options,
  cancelable = true,
}) {
  const { isShowing, toggle, close, modal } = useModal();

  const createDialogBox = () => {
    // console.log({ options });
    options = new Map(Object.entries(options));

    if (options.size === 1 && cancelable) options.set("cancel", close);

    console.log({ options });

    const exec = option => {
      options.get(option)();
      close();
    };

    return (
      <div className="prompt wrapper col">
        <p className="prompt-query">{message}</p>
        <Menu
          options={[...options.keys()]}
          handleChange={option => exec(option)}
          searchable={false}
        />
      </div>
    );
  };

  // console.log({ $MODAL: modal(createDialogBox()) });

  return (
    <>
      <button className="modal-btn" onClick={toggle}>
        {btnTxt}
      </button>
      {modal(createDialogBox())}
    </>
  );
}
