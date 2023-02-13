import "../../styles/form/ArraySet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import ArraySetEntry from "./ArraySetEntry";
import FieldSet from "./FieldSet";
import ArraySetNew from "./ArraySetNew";
import Table from "./Table";
import { useDBMaster } from "../contexts/DBContext";
import TableEntry from "./TableEntry";
import useTableElement from "../../hooks/useTableElement";
import ObjectNest from "./ObjectNest";
import useOpsCache from "../../hooks/useOpsCache";

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
  const { createButtons } = useOpsCache();

  // console.log({ entryDraft, submitDraft });

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

  const removeEntry = entry =>
    handleChange(Object.values(cache).filter(record => record !== entry));

  // ---------- EDIT ----------

  const editEntry = entry => {
    !expandNew && setExpandNew(prev => !prev);
    const index = Object.values(cache).indexOf(entry);
    // console.log({ index, entry });
    // newEntryEm.current.focus();

    setEntryDraft(entry);
    setSubmitDraft(() => update => {
      const mod = [...cache];
      mod[index] = update;
      handleChange(mod);
      resetDraft();
      setSubmitDraft(undefined);
    });
  };

  // ---------- CANCEL ----------

  const cancel = () => {
    resetDraft();
    setExpandNew(false);
    setSubmitDraft(undefined);
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
          submit={() => (submitDraft ? submitDraft(entryDraft) : addEntry())}
          cancel={cancel}
        />
      }
      {cache.length ? (
        createTable(cache, {
          omittedFields,
          ancestry,
          headers: Object.keys(Object.values(cache)[0]).filter(
            entry => !omittedFields.includes(entry)
          ),
          entryContents: entry => {
            return (
              <>
                {createButtons({
                  Edit: () => editEntry(entry),
                  Delete: () => removeEntry(entry),
                })}
                {<ObjectNest dataObj={entry} ancestry={ancestry} />}
              </>
            );
          },
        })
      ) : (
        <span className="fade">No entries</span>
      )}
    </FieldSet>
  ) : (
    "No entry"
  );
}
