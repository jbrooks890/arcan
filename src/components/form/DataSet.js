import { useEffect, useRef, useState } from "react";
import DataSetItem from "./DataSetItem";
import TermInput from "./TermInput";
import WordBank from "./WordBank";

const DataSet = ({
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
}) => {
  const [entry, setEntry] = useState("");
  const inputs = useRef([]);

  // console.log("\nTEST:\n", props);
  // console.log("options:\n", options);
  // console.log({ inputText });

  // secondaries?.length && console.log(secondaries);

  const BANK = options ? options : cache;

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
              option={option}
              secondaries={secondaries}
              field={field}
              single={single}
            />
            // <label key={i} htmlFor={option} className="flex start middle">
            //   <input
            //     ref={element => (inputs.current[i] = element)}
            //     id={option}
            //     name={field}
            //     type={single ? "radio" : "checkbox"}
            //     value={option}
            //     // checked={option === value}
            //     onChange={() =>
            //       handleChange(
            //         single
            //           ? option
            //           : inputs.current
            //               .filter(input => input.checked)
            //               .map(input => input.value)
            //       )
            //     }
            //   />
            //   <div className={`ticker ${single ? "radio" : "checkbox"}`} />
            //   <div>{option}</div>
            // </label>
          ))}
        </ul>
      ) : (
        <span className="fade">No entries</span>
      )}
    </fieldset>
  );
};

export default DataSet;
