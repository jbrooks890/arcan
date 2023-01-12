import "../../styles/form/Accordion.css";
import { useRef, useState } from "react";

const Accordion = ({ field, list, mode = false }) => {
  const [open, setOpen] = useState(mode);
  const listEm = useRef();

  const toggle = () => setOpen(prev => !prev);

  // console.log({ field, list });

  return (
    <div className={`accordion ${open ? "open" : "closed"}`}>
      <strong className="flex middle" onClick={toggle}>
        <div className="arrow flex center" />
        {field}
      </strong>
      {list}
    </div>
  );
};

export default Accordion;
