import "../../styles/FormPreview.css";

const FormPreview = ({ name, form, className, handleSubmit }) => {
  // console.log({ name, form });

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
    <div className={`form-preview flex col ${className ?? ""}`}>
      <h2>{name}</h2>
      <div className={`wrapper flex col`}>{buildList(form)}</div>
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default FormPreview;
