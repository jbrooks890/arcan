import ObjectNest from "./ObjectNest";

const ArraySetEntry = ({ obj, collection, ancestry }) => {
  // console.log({ obj });
  return (
    <div className={`array-set-entry flex col`}>
      <ObjectNest dataObj={obj} collectionName={collection} />
      <div className="flex">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

export default ArraySetEntry;
