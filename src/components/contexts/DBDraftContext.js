import { createContext, useContext } from "react";
import { useDBMaster } from "./DBContext";

const DBDraft = createContext();
export const useDBDraft = () => useContext(DBDraft);

export default function DBDraftProvider({ state, children }) {
  const { arcanData } = useDBMaster();
  const { models, dependencies } = arcanData;

  // :::::::::::::\ GET PATH DATA /:::::::::::::

  const getPathData = (ancestors, collection) => {
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

  return (
    <DBDraft.Provider value={{ ...state, getPathData }}>
      {children}
    </DBDraft.Provider>
  );
}
