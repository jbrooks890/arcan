import { useDBMaster } from "../contexts/DBContext";
import { useDBDraft } from "../contexts/DBDraftContext";
import Accordion from "./Accordion";

export default function ObjectNest({
  dataObj,
  id,
  className,
  ancestry = [],
  ...props
}) {
  const { arcanData, omittedFields } = useDBMaster();
  const { getPathData } = useDBDraft();
  const { models, references } = arcanData;

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
              references[options.ref ?? dataObj[options.refPath]][value]
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
      {buildList(dataObj, ancestry)}
    </div>
  );
}
