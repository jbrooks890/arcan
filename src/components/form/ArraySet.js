import "../../styles/form/ArraySet.css";
import { useEffect, useMemo, useState } from "react";
import ArraySetEntry from "./ArraySetEntry";
import FieldSet from "./FieldSet";
import ArraySetNew from "./ArraySetNew";

export default function ArraySet({
  field,
  schemaName,
  label,
  required,
  className,
  ancestry,
  createNewEntry,
  value = [],
  cache = value,
  handleChange,
}) {
  const [entryDraft, setEntryDraft] = useState();
  const newEntry = useMemo(
    () => createNewEntry(entryDraft, setEntryDraft),
    [entryDraft]
  );
  // const newEntry = createNewEntry(entryDraft, setEntryDraft);

  useEffect(
    () =>
      setEntryDraft(
        Object.fromEntries(newEntry.map(([path, data]) => [path, data.field]))
      ),
    []
  );
  // useEffect(() => entryDraft && console.log({ entryDraft }, [entryDraft]));

  // ---------- RESET ----------

  const resetDraft = () =>
    setEntryDraft(prev =>
      Object.fromEntries(Object.keys(prev).map(path => [path, undefined]))
    );

  // ---------- ADD ----------

  const addEntry = () => {
    handleChange([...cache, entryDraft]);
    resetDraft();
  };

  // ---------- REMOVE ----------

  const removeEntry = i => handleChange();
  const editEntry = () => {};

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return entryDraft ? (
    <FieldSet
      {...{ field, label, className: `array-set col ${className}`, required }}
    >
      {
        <ArraySetNew
          elements={newEntry.map(field => field[1].element)}
          add={addEntry}
        />
      }
      <div className="entries">
        {cache.map((data, i) => (
          <ArraySetEntry
            key={i}
            obj={data}
            collection={schemaName}
            ancestry={ancestry}
          />
        ))}
      </div>
    </FieldSet>
  ) : (
    "No entry"
  );
}
