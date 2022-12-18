import { useState } from "react";

const DataSetItem = ({ option, secondaries, field, single }) => {
  const [open, setOpen] = useState(false);

  return (
    <label htmlFor={option} className="flex start middle">
      <input
        id={option}
        name={field}
        type={single ? "radio" : "checkbox"}
        value={option}
        // checked={option === value}
        // onChange={() =>
        //   handleChange(
        //     single
        //       ? option
        //       : inputs.current
        //           .filter(input => input.checked)
        //           .map(input => input.value)
        //   )
        // }
      />
      <div className={`ticker ${single ? "radio" : "checkbox"}`} />
      <div className="wrapper">
        <span>{option}</span>
        <div className={`drawer ${open ? "open" : "closed"}`}>
          {secondaries}
        </div>
      </div>
    </label>
  );
};

export default DataSetItem;
