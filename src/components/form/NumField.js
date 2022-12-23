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
  const isFloat = step > 0 && step < 1;
  // console.log({ field, required });

  return (
    <label htmlFor={field} data-label={label}>
      <span className={required ? "required" : ""}>{label}</span>
      <input
        type="number"
        id={field}
        name={field}
        min={min}
        max={max}
        onChange={handleChange}
        step={step}
        value={value}
      />
    </label>
  );
};

export default NumField;
