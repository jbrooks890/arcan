import { useEffect } from "react";
import "../../styles/form/FieldSet.css";

const FieldSet = ({ field, label, children, className, required }) => {
  // console.log(fields);
  // useEffect(() => console.log({ required }), []);

  return (
    <fieldset
      className={`${field}-section wrapper flex ${className ? className : ""}`}
    >
      <legend className={required ? "required" : ""}>{label}</legend>
      {children}
    </fieldset>
  );
};

export default FieldSet;
