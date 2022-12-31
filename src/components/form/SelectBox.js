import { useRef, useState } from "react";
// import "../../styles/SelectBox.css";

export default function SelectBox({
  required,
  options,
  field,
  label,
  classList = [],
  handleChange,
  value,
}) {
  const [selected, setSelected] = useState(value ?? options[0]);
  const [open, setOpen] = useState(false);
  const list = useRef();

  // console.log({ value });

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
      <div className="wrapper">
        <div
          className={`option-display flex ${open ? "open" : ""}`}
          onClick={toggle}
          // onMouseLeave={() => setOpen(false)}
        >
          {selected || "--"}
        </div>
        <ul
          className={`option-list ${open ? "open" : ""}`}
          ref={list}
          style={open ? { maxHeight: list.current.scrollHeight + "px" } : null}
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((option, i) => (
            <li key={i} onClick={() => selectOption(option)}>
              {!option ? "--" : option === "other" ? <i>{option}</i> : option}
            </li>
          ))}
        </ul>
      </div>
    </label>
  );
}
