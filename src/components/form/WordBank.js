import { useRef, useState } from "react";

const WordBank = ({
  value,
  terms = [...value],
  label,
  field,
  required,
  update,
}) => {
  const [entry, setEntry] = useState("");
  const placeholder = field.replace(/([A-Z])/g, " $1");
  const submit = useRef();

  // console.log("VALUE:", { value });

  const addTerm = () => {
    if (entry.length && !terms.includes(entry)) {
      setEntry("");
      update([...terms, entry]);
    }
  };

  const removeTerm = term => update(terms.filter(entry => entry !== term));

  return (
    <fieldset className="word-bank">
      <legend className={required ? "required" : ""}>{label}</legend>
      <div className="new-entry-wrap flex middle">
        <input
          type="text"
          className="new-entry"
          placeholder={`New ${placeholder}`}
          value={entry}
          onChange={e => setEntry(e.currentTarget.value)}
          onKeyDown={e => e.key === "Enter" && submit.current.click()}
        />
        <button
          ref={submit}
          className="add-word flex center"
          onClick={addTerm}
        />
      </div>
      <ul className="entry-cache flex wrap">
        {terms.length ? (
          terms.map((term, i) => (
            <li key={i} className="entry flex middle">
              {term}
              <button
                className="delete-entry"
                onClick={() => removeTerm(term)}
              />
            </li>
          ))
        ) : (
          <span className="fade">No entries</span>
        )}
      </ul>
    </fieldset>
  );
};

export default WordBank;
