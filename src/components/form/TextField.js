import { useEffect, useRef, useState } from "react";
import ValidMarker from "./ValidMarker";

const TextField = ({
  field,
  placeholder,
  validation,
  error,
  label,
  required,
  criteria,
  handleChange,
  value,
  validator,
}) => {
  const [showCriteria, setShowCriteria] = useState(false);
  const criteriaRef = useRef();

  const toggleCriteria = () => {
    setShowCriteria(prev => !prev);
  };

  return (
    <label htmlFor={field} data-label={label}>
      <span onClick={criteria ? toggleCriteria : null}>
        {label}
        {required && <span className={required ? "required" : ""} />}
        {validation && required && <ValidMarker {...{ error }} />}
      </span>
      {criteria && (
        <ul
          ref={criteriaRef}
          className={`criteria ${showCriteria ? "show" : "hide"}`}
          style={
            showCriteria
              ? {
                  maxHeight: criteriaRef.current.scrollHeight + "px",
                }
              : null
          }
        >
          {criteria.split("; ").map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      )}
      <input
        name={field}
        type="text"
        placeholder={placeholder ?? ""}
        {...{ value }}
        onChange={handleChange}
        // onBlur={() => required && validator()}
      />
    </label>
  );
};

export default TextField;
