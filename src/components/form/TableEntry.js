import { useRef, useState } from "react";
import { useDBMaster } from "../contexts/DBContext";
import { useDBDraft } from "../contexts/DBDraftContext";

export default function TableEntry({ entry, headers, index, ancestry }) {
  const [open, setOpen] = useState(false);
  const dataList = useRef();
  const { getPathData } = useDBDraft();
  const { arcanData } = useDBMaster();
  const { references } = arcanData;

  // console.log({ entry });

  const toggle = () => setOpen(prev => !prev);

  const renderEntry = ancestors => {
    const pathData = getPathData(ancestors);
    const { instance, options } = pathData;
    const display = entry[ancestors.pop()];

    // instance === "ObjectID" && console.log({ display, instance });

    let render = display;

    if (typeof display === "object") render = Object.values(display).join(", ");
    if (Array.isArray(display)) render = `[ ${display.length} ]`;

    if (instance === "ObjectID") {
      const ref = options?.ref ?? options?.refPath;
      console.log({ ref, [display]: references[ref][display] });

      return <span data-oid={display}>{references[ref][display]}</span>;
    }
    return render;
  };

  return (
    <>
      {/* <tr onClick={toggle}></tr> */}
      <div className="entry-index">{index}</div>
      {headers.map((data, i) => {
        //   console.log({ data });
        return <div key={i}>{renderEntry([...ancestry, data])}</div>;
      })}
      <div
        ref={dataList}
        className={`data-list ${open ? "open" : "closed"}`}
        style={{
          maxHeight: open ? dataList.current.scrollHeight + "px" : null,
        }}
      >
        Test
      </div>
    </>
  );
}
