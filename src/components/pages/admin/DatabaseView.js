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
          const hasValue = value !== null && value !== undefined;
          const isArray = Array.isArray(obj[key]);

          // console.log({ key, ancestors: ancestors.join(" > ") });
          const root = ancestors[0] ?? key;
          const parent = ancestors[ancestors.length - 1];

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
    console.clear();
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
            <div className="legend">Collection</div>
            <Dropdown
              options={Object.keys(arcanData.models)}
              value={selection}
              handleChange={selectCollection}
            />
          </div>

          {/* ------- COLLECTION DATA ------- */}
          <div id="collection-data" className="fieldset flex middle">
            <div className="legend">Collection Data</div>
            <div className="data-cache flex middle">
              <div>
                Entries: {Object.keys(arcanData.dependencies[selection]).length}
              </div>
              <div>Filter</div>
            </div>
            <button className="add-new flex middle">New</button>
          </div>

          {/* ------- ENTRY MENU ------- */}
          <Menu
            label="Entries"
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
          <div id="entry-data" className="flex col">
            {entrySelection ? (
              <>
                <div id="entry-header" className="flex col">
                  <h3 id="entry-name" data-entry-id={entrySelection._id}>
                    {
                      arcanData.dependencies[selection].find(
                        entry => entry._id === entrySelection._id
                      ).name
                    }
                  </h3>
                  <h4 id="entry-id">{entrySelection._id}</h4>
                  <div className="button-cache">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </div>
                <div id="entry-fields" className="flex col">
                  {buildList(entrySelection)}
                </div>
              </>
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
