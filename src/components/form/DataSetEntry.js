import { useEffect, useRef, useState } from "react";
import DataSetItem from "./DataSetItem";
import TermInput from "./TermInput";
import WordBank from "./WordBank";

const DataSetEntry = ({
  field,
  required,
  options,
  inputText = !options?.length,
  single = true,
  label,
  className,
  cache = [],
  primary,
  secondaries,
  handleChange,
  values,
  secondaryFormFields,
}) => {
  const [entry, setEntry] = useState("");
  const inputs = useRef([]);
  const primaries = useRef([]);

  // console.log("\nTEST:\n", props);
  // console.log("options:\n", options);
  // console.log({ inputText });

  // secondaries?.length && console.log(secondaries);

  const BANK = options ? options : cache;

  const updateForm = option => {
    // console.log("\nTEST:", { option });
    handleChange(
      Object.keys(values).includes(option)
        ? Object.fromEntries(
            Object.entries(values).filter(([option]) =>
              primaries.current
                .filter(option => option.checked)
                .map(input => input.value)
                .includes(option)
            )
          )
        : { ...values, [option]: secondaryFormFields }
    );
  };

  return (
    <fieldset
      className={`choice-box word-bank complex ${
        className ? className : ""
      } flex col`}
    >
      <legend className={required ? "required" : ""}>{label}</legend>
      {inputText && <TermInput entry={entry} />}
      {BANK.length ? (
        <ul className="entry-cache flex col">
          {options.map((option, i) => (
            <DataSetItem
              key={i}
              setRef={element => (primaries.current[i] = element)}
              option={option}
              secondaries={secondaries}
              field={field}
              single={single}
              checked={Object.keys(values).includes(option)}
              handleChange={() => updateForm(option)}
            />
          ))}
        </ul>
      ) : (
        <span className="fade">No entries</span>
      )}
    </fieldset>
  );
};

export default DataSetEntry;
