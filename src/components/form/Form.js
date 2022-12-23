import "../../styles/Form.css";

const Form = ({
  children,
  className,
  autoComplete = false,
  spellCheck = false,
  handleSubmit = e => e.preventDefault(),
}) => {
  // console.log({ autoComplete, spellCheck });

  return (
    <form
      className={`custom-form ${className}`}
      onSubmit={handleSubmit}
      autoComplete={autoComplete ? "on" : "off"}
      spellCheck={spellCheck}
    >
      {children}
    </form>
  );
};

export default Form;
