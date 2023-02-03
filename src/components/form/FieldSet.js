import { useRef, useEffect } from "react";
import "../../styles/form/FieldSet.css";

const FieldSet = ({
  field,
  label,
  children,
  id,
  className,
  required,
  open,
}) => {
  const fieldset = useRef();
  const legend = useRef();

  return (
    <fieldset
      ref={fieldset}
      id={id ?? ""}
      className={`${className ? className : ""} ${
        field ? `${field}-section` : ""
      } group wrapper flex ${open ? "open" : "closed"}`}
    >
      <legend ref={legend} className={required ? "required" : ""}>
        {label}
      </legend>
      {children}
    </fieldset>
  );
};

export default FieldSet;
