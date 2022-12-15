const Menu = ({
  options,
  label = "Select",
  className,
  field = "selectMenu",
  handleChange,
}) => {
  return (
    <fieldset className={`select-menu ${className ? className : ""} flex col`}>
      <legend>{label}</legend>
      {options.map((option, i) => (
        <>
          <input
            key={i}
            id={option}
            name={field}
            type="radio"
            value={option}
            onChange={() => handleChange(option)}
          />
          <label htmlFor={option}>{option}</label>
        </>
      ))}
    </fieldset>
  );
};

export default Menu;
