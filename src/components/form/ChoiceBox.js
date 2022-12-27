import { useEffect, useRef, useState } from "react";
// import "../../styles/SelectBox.css";

export default function ChoiceBox({
  options,
  field,
  required,
  single = true,
  label,
  className,
  value,
  handleChange,
}) {
  // const [selections, setSelections] = useState([]); // TODO
  const inputs = useRef([]);

  // useEffect(() => console.table(inputs.current), []); // TODO

  return (
    <fieldset className={`choice-box ${className ? className : ""} flex col`}>
      <legend className={required ? "required" : ""}>{label}</legend>
      {options.length ? (
        options.map((option, i) => (
          <label key={i} htmlFor={option} className="flex start middle">
            <input
              ref={element => (inputs.current[i] = element)}
              id={option}
              name={field}
              type={single ? "radio" : "checkbox"}
              value={option}
              // checked={option === value}
              onChange={() =>
                handleChange(
                  single
                    ? option
                    : inputs.current
                        .filter(input => input.checked)
                        .map(input => input.value)
                )
              }
            />
            <div className={`ticker ${single ? "radio" : "checkbox"}`} />
            <div>{option}</div>
          </label>
        ))
      ) : (
        <span className="fade">No entries</span>
      )}
    </fieldset>
  );
}
