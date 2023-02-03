import { useRef, useState } from "react";
import { useDBMaster } from "../contexts/DBContext";
import { useDBDraft } from "../contexts/DBDraftContext";

export default function TableEntry({ entry, headers, index, ancestry }) {
  const [open, setOpen] = useState(false);
  const dataList = useRef();
  const { getPathData } = useDBDraft();
  const { arcanData } = useDBMaster();
  const { dependencies } = arcanData;

  const toggle = () => setOpen(prev => !prev);

  const renderEntry = ancestors => {
    const pathData = getPathData(ancestors);
    const { instance, options } = pathData;
    // console.log({ instance });
    const display = entry[ancestors.pop()];
    // instance === "ObjectID" && console.log({ display });
    if (instance === "ObjectID") {
      const ref = options?.ref ?? options?.refPath;
      //   console.log({ ref });
      return <span data-oid={display}>{dependencies[ref][display]}</span>;
    }
    return display;
  };

  return (
    <>
      <tr onClick={toggle}>
        <td>{index}</td>
        {headers.map((data, i) => {
          //   console.log({ data });
          return <td key={i}>{renderEntry([...ancestry, data])}</td>;
        })}
      </tr>
      <tr
        ref={dataList}
        className={`data-list ${open ? "open" : "closed"}`}
        style={{
          maxHeight: open ? dataList.current.scrollHeight + "px" : null,
        }}
      >
        <td colSpan={headers.length + 1}>Test</td>
      </tr>
    </>
  );
}
