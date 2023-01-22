import { useEffect, useRef, useState } from "react";
import DataSetItem from "./DataSetItem";
import TermInput from "./TermInput";
import WordBank from "./WordBank";

const DataSetEntry = ({
  field,
  required,
  options,
  display,
  inputText = !options?.length,
  single = true,
  label,
  className,
  cache = [],
  handleChange,
  value,
  createFields,
  // subFields,
}) => {
  const inputs = useRef([]);
  const primaries = useRef([]);

  // console.log("\nTEST:\n", props);
  // console.log("options:\n", options);
  // console.log({ inputText });

  // secondaries?.length && console.log(secondaries);

  const BANK = options ? options : cache;

  const update = (option, subFields) => {
    // console.log("\nTEST:", value);

    handleChange(
      Object.keys(value).includes(option)
        ? Object.fromEntries(
            Object.entries(value).filter(([option]) =>
              primaries.current
                .filter(option => option.checked)
                .map(input => input.value)
                .includes(option)
            )
          )
        : { ...value, [option]: subFields }
    );
  };

  const addEntry = entry => !value[entry] && update(entry);

  const removeEntry = entry =>
    Object.fromEntries(
      Object.entries(value).filter(([option]) =>
        primaries.current
          .filter(option => option.checked)
          .map(input => input.value)
          .includes(entry)
      )
    );

  // const updateEntry =

  return (
    <fieldset
      className={`choice-box complex ${className ? className : ""} flex col`}
    >
      <legend className={required ? "required" : ""}>{label}</legend>
      {inputText && <TermInput add={addEntry} />}
      {BANK.length ? (
        <ul className="entry-cache flex col">
          {options.map((option, i) => {
            const DATA = createFields(option);
            const ELEMENTS = DATA.map(entry => entry[1].element);
            const FIELDS = Object.fromEntries(
              DATA.map(([path, entry]) => [path, entry.field])
            );

            // console.log({ FIELDS });
            return (
              <DataSetItem
                key={i}
                setRef={element => (primaries.current[i] = element)}
                option={option}
                secondaries={ELEMENTS}
                field={field}
                single={single}
                checked={Object.keys(value).includes(option)}
                handleChange={() => update(option, FIELDS)}
              />
            );
          })}
        </ul>
      ) : (
        <span className="fade">No entries</span>
      )}
    </fieldset>
  );
};

export default DataSetEntry;
