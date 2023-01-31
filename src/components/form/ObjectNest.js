import { useDBMaster } from "../contexts/DBContext";
import Accordion from "./Accordion";

export default function ObjectNest({ dataObj, collectionName, id, className }) {
  const { arcanData, omittedFields } = useDBMaster();
  const { models, dependencies } = arcanData;

  // :::::::::::::\ GET PATH DATA /:::::::::::::

  const getPathData = (ancestors, collection = collectionName) => {
    // Navigate to the appropriate schema path
    const model = models[collection];
    const set = ancestors.reduce((paths, pathName) => {
      const current = paths[pathName];

      if (current) {
        if (current.instance) {
          const { instance } = current;
          if (instance === "Array")
            return current.caster || current.schema.paths;
          if (instance === "Map")
            return current.$__schemaType.options.type.paths;
        }
        return current.options?.type?.paths || current;
      }
      return paths;
    }, model.paths);

    return set;
  };
  // :::::::::::::\ BUILD LIST /:::::::::::::

  const buildList = (obj = {}, ancestors = []) => {
    obj = Object.fromEntries(
      Object.entries(obj).filter(([key]) => !omittedFields.includes(key))
    );

    return (
      <ul>
        {Object.entries(obj).map(([key, value], i) => {
          const isObject = typeof value === "object";

          // ---------- RENDER ENTRY ----------
          const renderEntry = () => {
            const pathData = getPathData([...ancestors, key]);
            const { instance, options } = pathData;

            // instance === "ObjectID" && console.log({ options });

            return value === null || value === undefined ? (
              <span className="fade">{"no entry"}</span>
            ) : instance === "ObjectID" ? (
              dependencies[options.ref ?? dataObj[options.refPath]][value]
            ) : (
              String(value)
            );
          };

          return (
            <li key={i} className={!isObject ? "flex" : ""}>
              {isObject ? (
                <Accordion
                  field={key}
                  list={buildList(value, [...ancestors, key])}
                  mode={Object.keys(value).length < 6}
                />
              ) : (
                <>
                  <strong className={isObject ? "flex middle" : ""}>
                    {key}
                  </strong>
                  <span>
                    {renderEntry()}
                    {/* {String(value)} */}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div id={id} className={className}>
      {buildList(dataObj)}
    </div>
  );
}
