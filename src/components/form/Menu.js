import { Fragment } from "react";
import "../../styles/form/SelectMenu.css";
import Search from "./Search";

const Menu = ({
  options,
  display,
  label = "Select",
  id,
  className,
  field = "selectMenu",
  value,
  searchable = true,
  handleChange,
}) => {
  return (
    <fieldset
      id={id}
      className={`select-menu ${className ? className : ""} flex col`}
    >
      <legend>{label}</legend>
      {searchable && <Search />}
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
          <label htmlFor={option}>{display ? display[option] : option}</label>
        </Fragment>
      ))}
    </fieldset>
  );
};

export default Menu;
