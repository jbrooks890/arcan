import FieldSet from "../components/form/FieldSet";
import Menu from "../components/form/Menu";
import useModal from "./useModal";

export default function usePrompt() {
  const { isShowing, close, modal } = useModal();

  const createDialogBox = (message, options) => {
    console.log({ options });

    return (
      <FieldSet className="prompt">
        <h3>{message}</h3>
        <Menu
          options={[...options.keys()]}
          handleChange={option => options.get(option)}
          searchable={false}
        />
      </FieldSet>
    );
  };

  const prompt = (
    message,
    options = { close },
    heading = "Prompt",
    cancellable = false
  ) => {
    // console.log({ options });
    const numOptions = options.size;

    return modal(
      createDialogBox(message, new Map(Object.entries(options))),
      "center"
    );
  };

  return { prompt };
}
