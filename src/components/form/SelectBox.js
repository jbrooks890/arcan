import { useRef, useState } from "react";
// import "../../styles/SelectBox.css";

export default function SelectBox({
  required,
  options,
  display,
  field,
  label,
  classList = [],
  handleChange,
  value,
}) {
  const [selected, setSelected] = useState(value ?? options[0]);
  const [open, setOpen] = useState(false);
  const list = useRef();

  const selectOption = selection => {
    handleChange(selection);
    setSelected(selection);
    setOpen(false);
  };

  const toggle = () => setOpen(prev => !prev);

  return (
    <label
      className={`select-box ${classList.length ? classList.join(" ") : ""}`}
    >
      <span className={required ? "required" : ""}>{label}</span>
      <select name={label} style={{ display: "none" }} defaultValue={selected}>
        {options.map((option, i) => (
          <option
            key={i}
            value={option}
            // selected={selected === option ? "selected" : null}
            // onChange={() => onChange(selected)}
          >
            {option}
          </option>
        ))}
      </select>
      <div
        className="wrapper"
        // onMouseLeave={() => open && toggle()}
        // onBlur={() => open && toggle()}
      >
        <div
          className={`option-display flex ${open ? "open" : ""}`}
          onClick={toggle}
          // onMouseLeave={() => setOpen(false)}
        >
          {selected && display ? display[selected] : "--"}
        </div>
        <ul
          className={`option-list ${open ? "open" : ""}`}
          ref={list}
          style={open ? { maxHeight: list.current.scrollHeight + "px" } : null}
          onMouseLeave={() => open && toggle()}
          // onBlur={() => setOpen(false)}
        >
          {options.map((option, i) => (
            <li
              key={i}
              className={display ? "display" : ""}
              data-choice={option}
              data-choice-display={display?.[option]}
              onClick={() => selectOption(option)}
            >
              {!option ? (
                "--"
              ) : option === "other" ? (
                <i>{option}</i>
              ) : display ? (
                display[option]
              ) : (
                option
              )}
            </li>
          ))}
        </ul>
      </div>
    </label>
  );
}
