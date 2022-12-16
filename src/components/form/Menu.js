import { Fragment } from "react";

const Menu = ({
  options,
  label = "Select",
  className,
  field = "selectMenu",
  value,
  handleChange,
}) => {
  return (
    <fieldset className={`select-menu ${className ? className : ""} flex col`}>
      <legend>{label}</legend>
      {options.map((option, i) => (
        <Fragment key={i}>
          <input
            id={option}
            name={field}
            type="radio"
            value={option}
            checked={option === value}
            onChange={() => handleChange(option)}
          />
          <label htmlFor={option}>{option}</label>
        </Fragment>
      ))}
    </fieldset>
  );
};

export default Menu;
