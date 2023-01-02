import { useRef } from "react";

const NumField = ({
  label,
  field,
  required,
  handleChange,
  value,
  min,
  max,
  step = 1,
}) => {
  const input = useRef();
  const isFloat = step > 0 && step < 1;
  // console.log({ field, required });
  // console.log({ field, value });

  return (
    <label htmlFor={field} data-label={label}>
      <span className={required ? "required" : ""}>{label}</span>
      <input
        ref={input}
        type="number"
        // id={field}
        name={field}
        min={min}
        max={max}
        onChange={handleChange}
        // onMouseEnter={e => e.currentTarget.focus()}
        step={step}
        value={value ?? min}
      />
    </label>
  );
};

export default NumField;
