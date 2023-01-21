import Accordion from "./Accordion";

export default function ObjectNest({ dataObj }) {
  // :::::::::::::\ GET PATH DATA /:::::::::::::

  const getPathData = (ancestors, collection = selection) => {
    // Navigate to the appropriate schema path
    const model = arcanData.models[collection];

    // SET=
    const set = ancestors.reduce((paths, pathName) => {
      const current = paths[pathName];
      // console.log({ pathName, paths, current });

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
      Object.entries(obj).filter(
        ([key]) => !["_id", "id", "createdAt", "updatedAt", "__v"].includes(key)
      )
    );

    return (
      <ul>
        {Object.entries(obj).map(([key, value], i) => {
          const isObject = typeof value === "object";
          const renderEntry = () => {
            const pathData = getPathData([...ancestors, key]);
            const { instance, options } = pathData;

            return instance === "ObjectID"
              ? arcanData.dependencies[options.ref].find(
                  entry => entry._id === value
                ).name
              : String(value);
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

  return <div>ObjectNest</div>;
}
