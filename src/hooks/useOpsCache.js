import ButtonCache from "../components/form/ButtonCache";

export default function useOpsCache() {
  const createButtons = buttons => {
    return (
      <ButtonCache>
        {Object.entries(buttons).map(([btnTxt, btnFn], i) => (
          <button key={i} onClick={btnFn}>
            {btnTxt}
          </button>
        ))}
      </ButtonCache>
    );
  };
  return { createButtons };
}
