import "../../styles/FormPreview.css";

const FormPreview = ({
  form,
  id,
  className,
  legend = "Preview",
  heading = "Summary",
  buttonText = "Submit",
  handleSubmit,
}) => {
  // console.log({ heading, form });

  const buildList = (obj = {}) => {
    return (
      <ul>
        {Object.entries(obj).map(([key, value], i) => {
          const isObject = typeof value === "object";
          const hasValue = value !== null && value !== undefined;
          return (
            <li key={i} className={isObject ? "dropdown" : ""}>
              <label style={{ display: "inline-block" }}>
                <strong>{key}</strong>
                {isObject && (
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    style={{ display: "none" }}
                  />
                )}

                {isObject ? (
                  buildList(value)
                ) : (
                  <span
                    className={`form-preview-entry ${!hasValue ? "fade" : ""}`}
                  >
                    {hasValue ? String(value) : "no entry"}
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    );
  };

  // const handleSubmit = e => e.preventDefault();

  return (
    <div
      id={id}
      className={`form-preview fieldset flex col ${className ?? ""}`}
    >
      <span className="legend">{legend}</span>
      <h2>{heading}</h2>
      <div className={`wrapper flex col`}>{buildList(form)}</div>
      <button type="submit" onClick={handleSubmit}>
        {buttonText}
      </button>
    </div>
  );
};

export default FormPreview;
