import React, { useRef } from "react";

const TermInput = ({
  entry,
  placeholder,
  addTerm = () => console.log("TODO:REMOVE THIS"),
  handleChange,
}) => {
  const submit = useRef();

  return (
    <div className="new-entry-wrap flex middle">
      <input
        type="text"
        className="new-entry"
        placeholder={placeholder ? `New ${placeholder}` : "cheese"}
        value={entry}
        // onChange={handleChange}
        onKeyDown={e => e.key === "Enter" && submit.current.click()}
      />
      <button ref={submit} className="add-word flex center" onClick={addTerm} />
    </div>
  );
};

export default TermInput;
