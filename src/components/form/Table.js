import "../../styles/form/Table.css";
import { useDBMaster } from "../contexts/DBContext";
import TableEntry from "./TableEntry";

export default function Table({
  data = {},
  id,
  className,
  ancestry = [],
  omitted = [],
}) {
  // console.log({ data });

  const isArray = Array.isArray(data);
  const headers = Object.keys(Object.values(data)[0]).filter(
    entry => !omitted.includes(entry)
  );

  // console.log({ isArray, headers });

  return (
    <div
      id={id}
      className={`data-table grid ${className} ${isArray ? "array" : ""}`}
      style={{
        ["--columns"]: isArray ? headers.length : headers.length + 1,
        ["--rows"]: Object.values(data).length * 2 - 1,
      }}
    >
      <div className="corner" />
      {headers.map((col, i) => (
        <div key={i} className="header">
          {col}
        </div>
      ))}
      {Object.entries(data).map(([index, entry], i) => (
        <TableEntry
          key={i}
          {...{ index, headers, entry, ancestry: [...ancestry, i] }}
        />
      ))}
    </div>
  );
}
