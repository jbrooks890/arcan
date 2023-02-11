import Table from "../components/form/Table";
import TableEntry from "../components/form/TableEntry";

export default function useTableElement() {
  const createTable = (data, options) => {
    const {
      omittedFields = [],
      headers = Object.keys(Object.values(data)[0]).filter(
        entry => !omittedFields.includes(entry)
      ),
      ancestry = [],
      entryContents,
      ...props
    } = options;
    const isArray = Array.isArray(data);

    // console.log({ data, props });
    const flattenData = (obj, path = []) => {
      const isArr = Array.isArray(obj);
    };

    return (
      <Table {...{ headers, isArray }}>
        {Object.entries(data).map(([index, entry], i) => {
          return (
            <TableEntry
              {...{ index, entry, headers }}
              key={i}
              ancestry={[...ancestry, i]}
            >
              {entryContents}
            </TableEntry>
          );
        })}
      </Table>
    );
  };
  return { createTable };
}
