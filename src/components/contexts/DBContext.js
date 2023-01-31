import { useContext, createContext, useState, useEffect } from "react";
import axios from "../../apis/axios";

const DBContext = createContext();
export const useDBMaster = () => useContext(DBContext);

export default function DBContextProvider({ state, children }) {
  const [arcanData, setArcanData] = useState();
  const omittedFields = ["_id", "id", "createdAt", "updatedAt", "__v"];

  // :::::::::::::\ FETCH MODELS /:::::::::::::

  async function fetchModels() {
    const response = await axios.get("/models");
    // console.log("DATA:", response.data);

    let [models, dependencies] = Object.entries(response.data)
      .map(([name, { schema, collection }]) => {
        return [
          [name, schema],
          [
            name,
            Object.fromEntries(collection.map(({ _id, name }) => [_id, name])),
          ],
        ];
      })
      .reduce(
        ([$schemata, $collections], [schema, collection]) => {
          // console.log({ collection });
          return [
            [...$schemata, schema],
            [...$collections, collection],
          ];
        },
        [[], []]
      );

    models = Object.fromEntries(models);
    dependencies = Object.fromEntries(dependencies);

    setArcanData({ models, dependencies });
  }

  useEffect(() => fetchModels(), []);

  // :::::::::::::\ FETCH ENTRY /:::::::::::::

  async function fetchEntry(selection, entry_id) {
    try {
      const response = await axios.get(`/${selection}/${entry_id}`);
      console.log({ RESPONSE: response.data });
    } catch (err) {
      console.error(err);
    }
  }

  // :::::::::::::\ UPDATE ARCAN DATA /:::::::::::::

  const updateArcanData = (newData, collection) => {
    setArcanData(prev => {
      const { _id, name, subtitle, title, username } = newData;

      const NAME =
        (typeof name === "object" ? name[Object.keys(name)[0]] : name) ??
        subtitle ??
        title ??
        username ??
        `${collection}: ${_id}`;

      return {
        ...prev,
        dependencies: {
          ...prev.dependencies,
          [collection]: { ...prev.dependencies[collection], [_id]: NAME },
        },
      };
    });
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <DBContext.Provider
      value={{
        arcanData,
        setArcanData,
        updateArcanData,
        omittedFields,
        fetchModels,
        fetchEntry,
      }}
    >
      {arcanData ? children : "Loading..."}
    </DBContext.Provider>
  );
}
