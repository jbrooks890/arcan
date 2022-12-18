import { useRef, useState } from "react";

const DataSetItem = ({ option, secondaries, field, single }) => {
  const [open, setOpen] = useState(false);
  const drawer = useRef();

  return (
    <label htmlFor={option} className="flex col">
      <div className="wrapper">
        <div
          className={`entry-header flex middle ${open ? "open" : "closed"}`}
          onClick={() => setOpen(prev => !prev)}
        >
          <input
            id={option}
            name={field}
            type={single ? "radio" : "checkbox"}
            value={option}
          />
          <div className={`ticker ${single ? "radio" : "checkbox"}`} />
          <span>{option}</span>
          <button className="arrow" onClick={() => setOpen(prev => !prev)} />
        </div>
        <div
          ref={drawer}
          className={`drawer ${open ? "open" : "closed"}`}
          style={{ maxHeight: open && drawer.current.scrollHeight + "px" }}
        >
          {secondaries}
        </div>
      </div>
    </label>
  );
};

export default DataSetItem;
