import "../../styles/form/ArraySet.css";
import { useEffect, useMemo, useState } from "react";
import ArraySetEntry from "./ArraySetEntry";
import FieldSet from "./FieldSet";
import ArraySetNew from "./ArraySetNew";
import Table from "./Table";
import { useDBMaster } from "../contexts/DBContext";

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
  const { omittedFields } = useDBMaster();
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

  // ---------- EDIT ----------

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
      {cache.length ? (
        <Table data={cache} omitted={omittedFields} ancestry={ancestry} />
      ) : (
        <span className="fade">No entries</span>
      )}
    </FieldSet>
  ) : (
    "No entry"
  );
}
