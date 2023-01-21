import FieldSet from "./FieldSet";

const ArraySet = ({
  field,
  label,
  required,
  className,
  newEntry,
  createElements,
  value = [],
  cache = value,
  handleChange,
}) => {
  // console.log({ value, cache });

  const addEntry = () => handleChange([...cache, newEntry]);

  return (
    <FieldSet
      {...{ field, label, className: `array-set col ${className}`, required }}
    >
      <button onClick={addEntry}>add new</button>
      <div className="entries">
        {cache.map((_, i) => (
          <div key={i} className={`${field}-entry`}>
            {createElements(i).map(entry => entry[1].element)}
          </div>
        ))}
      </div>
    </FieldSet>
  );
};

export default ArraySet;
