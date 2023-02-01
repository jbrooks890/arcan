import ObjectNest from "./ObjectNest";
import Table from "./Table";

const ArraySetEntry = ({ obj, ancestry }) => {
  // console.log({ obj });
  return (
    <div className={`array-set-entry flex col`}>
      <ObjectNest dataObj={obj} ancestry={ancestry} />
      <div className="flex">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

export default ArraySetEntry;
