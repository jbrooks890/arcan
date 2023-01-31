import FieldSet from "./FieldSet";

const ArraySetNew = ({ elements, addBtnTxt = "add", add }) => {
  return (
    <FieldSet label="New" className="col">
      {elements}
      <button className="add-btn flex center" onClick={add}>
        {addBtnTxt}
      </button>
    </FieldSet>
  );
};

export default ArraySetNew;
