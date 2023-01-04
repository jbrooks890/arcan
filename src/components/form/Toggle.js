import { useRef } from "react";

const Toggle = ({
  classList = [],
  field,
  label,
  handleChange,
  value = false,
}) => {
  const input = useRef();

  // console.log(props);
  // console.log({ label, field });

  return (
    <label className="toggle" htmlFor={field}>
      <span>{label}</span>
      <input
        ref={input}
        type="checkbox"
        // id={field}
        onChange={handleChange}
        checked={value}
      />
      <div className="cb-toggle" />
    </label>
  );
};

export default Toggle;
