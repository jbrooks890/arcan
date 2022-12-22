import React, { useRef, useState } from "react";

const TermInput = ({ placeholder, add, onChange }) => {
  const [entry, setEntry] = useState("");
  const submit = useRef();

  return (
    <div className="new-entry-wrap flex middle">
      <input
        type="text"
        className="new-entry"
        placeholder={placeholder ? `New ${placeholder}` : "cheese"}
        value={entry}
        onChange={e => setEntry(e.currentTarget.value)}
        onKeyDown={e => e.key === "Enter" && submit.current.click()}
      />
      <button
        ref={submit}
        className="add-word flex center"
        onClick={() => add(entry)}
      />
    </div>
  );
};

export default TermInput;
