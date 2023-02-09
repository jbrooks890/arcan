import { useState } from "react";
import FieldSet from "./FieldSet";

const ArraySetNew = ({ elements, addBtnTxt = "add", add }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded(prev => !prev);

  return (
    <FieldSet label="New" className={`array-set-new col`} open={expanded}>
      {expanded ? (
        <>
          {elements}
          <button className="add-btn flex center" onClick={add}>
            {addBtnTxt}
          </button>
          <button onClick={() => setExpanded(false)}>cancel</button>
        </>
      ) : (
        <button onClick={toggle}>Add New</button>
      )}
    </FieldSet>
  );
};

export default ArraySetNew;
