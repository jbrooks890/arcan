import { useEffect } from "react";

const FieldSet = ({ field, label, children, className, required }) => {
  // console.log(fields);
  // useEffect(() => console.log({ required }), []);

  return (
    <fieldset className={`${field}-section wrapper flex ${className}`}>
      <legend className={required ? "required" : ""}>{label}</legend>
      {children}
    </fieldset>
  );
};

export default FieldSet;
