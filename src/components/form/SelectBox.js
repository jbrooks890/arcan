import { useRef, useState } from "react";
// import "../../styles/SelectBox.css";

export default function SelectBox({
  options,
  field,
  required,
  label,
  classList = [],
  onChange,
}) {
  const [selected, setSelected] = useState(options[0]);
  const [open, toggleOpen] = useState(false);
  const list = useRef();

  const selectOption = selection => {
    onChange(selection);
    setSelected(selection);
    toggleOpen(false);
  };

  return (
    <label
      className={`select-box ${classList.length ? classList.join(" ") : ""}`}
    >
      <span>{label}</span>
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
          onClick={() => toggleOpen(prev => !prev)}
        >
          {selected}
        </div>
        <ul
          className={`option-list ${open ? "open" : ""}`}
          ref={list}
          style={open ? { maxHeight: list.current.scrollHeight + "px" } : null}
        >
          {options.map((option, i) => (
            <li key={i} onClick={() => selectOption(option)}>
              {option}
            </li>
          ))}
        </ul>
      </div>
    </label>
  );
}
