import "../../styles/form/Table.css";
import { useDBMaster } from "../contexts/DBContext";
import TableEntry from "./TableEntry";
import Checkbox from "./Checkbox";

export default function Table({
  data = {},
  id,
  className,
  omitted = [],
  headers = Object.keys(Object.values(data)[0]).filter(
    entry => !omitted.includes(entry)
  ),
  isArray,
  ancestry = [],
  selections = [],
  setSelections,
  children,
}) {
  // const isArray = Array.isArray(data);

  return (
    <table
      id={id}
      className={`data-table ${className} ${isArray ? "array" : ""}`}
    >
      <thead>
        <tr>
          <th className="corner">
            <input type="checkbox" />
          </th>
          {headers.map((col, i) => (
            <th key={i} className="header">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
