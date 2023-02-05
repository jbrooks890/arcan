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
    const isArray = Array.isArray(display);

    // instance === "ObjectID" && console.log({ display, instance });

    let render = display;

    if (typeof display === "object") render = Object.values(display).join(", ");
    if (isArray) render = `[ ${display.length} ]`;

    if (instance === "ObjectID") {
      const ref = options?.ref ?? options?.refPath;
      // console.log({ ref, [display]: references[ref][display] });

      return <span data-oid={display}>{references[ref][display]}</span>;
    }
    return render;
  };

  return (
    <>
      <tr onClick={toggle}>
        {<td className="entry-index">{index}</td>}
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
        <td colSpan={0}>Test</td>
      </tr>
    </>
  );
}
