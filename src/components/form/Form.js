import "../../styles/Form.css";

const Form = ({
  children,
  className,
  autocomplete,
  handleSubmit = e => e.preventDefault(),
}) => {
  return (
    <form
      className={`custom-form ${className}`}
      onSubmit={handleSubmit}
      autoComplete={autocomplete ? "on" : "off"}
    >
      {children}
    </form>
  );
};

export default Form;
