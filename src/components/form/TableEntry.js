import { useRef, useState } from "react";

export default function TableEntry({ entry, headers, index }) {
  const [open, setOpen] = useState(false);
  const dataList = useRef();

  const toggle = () => setOpen(prev => !prev);

  return (
    <>
      <tr onClick={toggle}>
        <td>{index}</td>
        {headers.map(data => (
          <td>{entry[data]}</td>
        ))}
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
