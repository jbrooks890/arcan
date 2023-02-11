import "../../styles/form/ArraySet.css";
import { useEffect, useMemo, useState } from "react";
import ArraySetEntry from "./ArraySetEntry";
import FieldSet from "./FieldSet";
import ArraySetNew from "./ArraySetNew";
import Table from "./Table";
import { useDBMaster } from "../contexts/DBContext";
import TableEntry from "./TableEntry";
import useTableElement from "../../hooks/useTableElement";

export default function ArraySet({
  field,
  fieldPath,
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
  // const [selectedEntries, setSelectedEntries] = useState([]);
  const [expandNew, setExpandNew] = useState(false);
  const [submitDraft, setSubmitDraft] = useState();
  const { omittedFields, models } = useDBMaster();
  const { createTable } = useTableElement();

  useEffect(
    () =>
      setEntryDraft(
        Object.fromEntries(newEntry.map(([path, data]) => [path, data.field]))
      ),
    []
  );

  // ---------- RESET ----------

  const resetDraft = () =>
    setEntryDraft(prev =>
      Object.fromEntries(Object.keys(prev).map(path => [path, undefined]))
    );

  // ---------- ADD ----------

  function addEntry() {
    handleChange([...cache, entryDraft]);
    resetDraft();
  }

  // ---------- REMOVE ----------

  const removeEntry = index => handleChange();

  // ---------- EDIT ----------

  const editEntry = index => {
    !expandNew && setExpandNew(prev => !prev);
    setEntryDraft(cache[index]);
    setSubmitDraft(() => {
      const mod = [...cache];
      mod[index] = entryDraft;
      handleChange(mod);
      resetDraft();
      setSubmitDraft(undefined);
    });
  };

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
          expanded={expandNew}
          setExpanded={setExpandNew}
          add={submitDraft ?? addEntry}
        />
      }
      {cache.length ? (
        createTable(cache, {
          omittedFields,
          ancestry,
          headers: Object.keys(Object.values(cache)[0]).filter(
            entry => !omittedFields.includes(entry)
          ),
        })
      ) : (
        <span className="fade">No entries</span>
      )}
    </FieldSet>
  ) : (
    "No entry"
  );
}
