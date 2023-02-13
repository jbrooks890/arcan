import { useState } from "react";
import FieldSet from "./FieldSet";

const ArraySetNew = ({
  elements,
  submitBtnTxt = "submit",
  submit,
  cancel,
  cancelBtnTxt = "cancel",
  expanded,
  setExpanded,
}) => {
  // const [expanded, setExpanded] = useState(isOpen);

  const toggle = () => setExpanded(prev => !prev);

  return (
    <FieldSet label="New" className={`array-set-new col`} open={expanded}>
      {expanded ? (
        <>
          {elements}
          <button className="add-btn flex center" onClick={submit}>
            {submitBtnTxt}
          </button>
          <button onClick={cancel}>{cancelBtnTxt}</button>
        </>
      ) : (
        <button onClick={toggle}>Add New</button>
      )}
    </FieldSet>
  );
};

export default ArraySetNew;
