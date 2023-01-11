import { useState } from "react";

const AccordionNest = ({ children, id, className, field, defOpen = false }) => {
  const [open, setOpen] = useState(defOpen);

  const toggle = () => setOpen(prev => !prev);

  return (
    <ul id={id} className={`accordion ${className}`}>
      <strong onClick={toggle}>
        <div className="arrow" />
        {field}
      </strong>
      {children}
    </ul>
  );
};

export default AccordionNest;
