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
    <table
      id={id}
      className={`data-table ${className} ${isArray ? "array" : ""}`}
    >
      <thead>
        <tr>
          <th className="corner" />
          {headers.map((col, i) => (
            <th key={i} className="header">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([index, entry], i) => (
          <TableEntry
            key={i}
            {...{ index, headers, entry, ancestry: [...ancestry, i] }}
          />
        ))}
      </tbody>
    </table>
  );
}
