import { useRef } from "react";

const Toggle = ({ classList = [], field, label, onChange, def = false }) => {
  const input = useRef();

  // console.log(props);
  // console.log({ label, field });

  return (
    <label className="toggle" htmlFor={field}>
      <span>{label}</span>
      <input
        ref={input}
        type="checkbox"
        id={field}
        onChange={onChange}
        // checked={def}
      />
      <div className="cb-toggle" />
    </label>
  );
};

export default Toggle;
