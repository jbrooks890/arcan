import { useEffect, useRef, useState } from "react";
import "../../styles/form/ChoiceBox.css";

export default function ChoiceBox({
  options,
  display,
  field,
  fieldPath,
  required,
  single = true,
  label,
  className,
  value = [],
  handleChange,
}) {
  const inputs = useRef([]);

  // display && console.log({ field, display });
  // useEffect(() => console.log({ field, fieldPath }), []);
  // useEffect(() => console.log({ field, options }), []);
  // useEffect(() => console.log({ field, inputs: inputs.current }), []);

  return (
    <fieldset className={`choice-box ${className ? className : ""} flex col`}>
      <legend className={required ? "required" : ""}>{label}</legend>
      {options.length ? (
        options.map((option, i) => {
          const id = `${fieldPath}-${option}`;
          return (
            <label key={i} htmlFor={id} className="flex start middle">
              <input
                ref={element => (inputs.current[i] = element)}
                id={id}
                name={id}
                type={single ? "radio" : "checkbox"}
                value={option}
                checked={option === value || value.includes(option)}
                onChange={() =>
                  handleChange(
                    single
                      ? option
                      : inputs.current
                          .filter(input => input?.checked)
                          .map(input => input.value)
                  )
                }
              />
              <div className={`ticker ${single ? "radio" : "checkbox"}`} />
              <div>{display ? display[option] : option}</div>
            </label>
          );
        })
      ) : (
        <span className="fade">No entries</span>
      )}
    </fieldset>
  );
}
