import "../../../styles/DatabaseView.css";
import "../../../styles/Form.css";
import axios from "../../../apis/axios";
import { useState, useEffect } from "react";
import Dropdown from "../../form/Dropdown";
import Menu from "../../form/Menu";
import AccordionNest from "../../form/AccordionNest";
import Accordion from "../../form/Accordion";

const DatabaseView = () => {
  const [arcanData, setArcanData] = useState();
  const [selection, setSelection] = useState();
  const [entrySelection, setEntrySelection] = useState();

  // :::::::::::::\ FETCH MODELS /:::::::::::::

  const fetchModels = async () => {
    const response = await axios.get("/models");
    // console.log("DATA:", response.data);

    let [models, dependencies] = Object.entries(response.data)
      .map(([name, { schema, collection }]) => [
        [name, schema],
        [name, collection],
      ])
      .reduce(
        ([$schemata, $collections], [schema, collection]) => [
          [...$schemata, schema],
          [...$collections, collection],
        ],
        [[], []]
      );

    models = Object.fromEntries(models);
    dependencies = Object.fromEntries(dependencies);

    setArcanData({ models, dependencies });
    setSelection(Object.keys(models)[0]);
  };

  useEffect(() => fetchModels(), []);

  useEffect(() => arcanData && console.log({ arcanData }), [arcanData]);

  // :::::::::::::\ GET PATH DATA /:::::::::::::

  const getPathData = (path, collection = selection) => {
    return arcanData.models[collection].paths[path];
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
          const hasValue = value !== null && value !== undefined;

          // console.log({ key, ancestors });
          const root = ancestors[0] ?? key;
          const parent = ancestors[ancestors.length - 1];
          const pathData = getPathData(root);
          const { instance, options } = pathData;
          instance === "ObjectID" &&
            console.log({
              key,
              value,
              ref: arcanData.dependencies[options.ref],
            });
          // console.log({ key, parent, root });

          return (
            <li key={i} className={!isObject ? "flex" : ""}>
              {isObject ? (
                <Accordion
                  field={key}
                  list={buildList(value, [...ancestors, key])}
                />
              ) : (
                <>
                  <strong className={isObject ? "flex middle" : ""}>
                    {key}
                  </strong>
                  <span>
                    {instance === "ObjectID"
                      ? arcanData.dependencies[options.ref].find(
                          entry => entry._id === value
                        ).name
                      : String(value)}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // :::::::::::::\ FETCH ENTRY /:::::::::::::

  const fetchEntry = async entry_id => {
    try {
      const response = await axios.get(`/${selection}/${entry_id}`);
      console.log({ RESPONSE: response.data });
      setEntrySelection(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // :::::::::::::\ SELECT COLLECTION /:::::::::::::

  const selectCollection = name => {
    setSelection(name);
    setEntrySelection("");
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <main id="database-view" className="flex col middle">
      {selection ? (
        <div id="database-view-wrapper" className="grid">
          {/* ------- COLLECTION SELECTOR ------- */}
          <div id="collection-select" className="fieldset flex middle">
            <div className="legend">Collections</div>
            <Dropdown
              options={Object.keys(arcanData.models)}
              value={selection}
              handleChange={selectCollection}
            />
          </div>

          {/* ------- COLLECTION DATA ------- */}
          <div id="collection-data" className="fieldset flex middle">
            <div className="legend">Collection Data</div>
            <div>
              Entries: {Object.keys(arcanData.dependencies[selection]).length}
            </div>
          </div>

          {/* ------- ENTRY MENU ------- */}
          <Menu
            label={`Entries (${
              Object.keys(arcanData.dependencies[selection]).length
            })`}
            options={Object.values(arcanData.dependencies[selection]).map(
              entry => entry._id
            )}
            display={Object.fromEntries(
              Object.values(arcanData.dependencies[selection]).map(entry => [
                entry._id,
                entry.name,
              ])
            )}
            handleChange={entry => fetchEntry(entry)}
            id="collection-entry-list"
          />

          {/* ------- ENTRY DATA ------- */}
          <div id="entry-data">
            {entrySelection ? (
              buildList(entrySelection)
            ) : (
              <span className="fade">No selection</span>
            )}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
};

export default DatabaseView;
