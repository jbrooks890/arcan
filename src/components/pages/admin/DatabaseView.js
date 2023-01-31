import "../../../styles/DatabaseView.css";
import "../../../styles/Form.css";
import axios from "../../../apis/axios";
import { useState, useEffect } from "react";
import Dropdown from "../../form/Dropdown";
import Menu from "../../form/Menu";
import Accordion from "../../form/Accordion";
import DatabaseDraft from "./DatabaseDraft";
import DBContextProvider, { useDBMaster } from "../../contexts/DBContext";
import DBDraftProvider from "../../contexts/DBDraftContext";
import ObjectNest from "../../form/ObjectNest";

const DatabaseView = () => {
  const { arcanData, setArcanData, updateArcanData } = useDBMaster();
  const [selection, setSelection] = useState(Object.keys(arcanData?.models)[0]);
  const [entrySelection, setEntrySelection] = useState();
  const [draftMode, setDraftMode] = useState(false);

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

          const renderEntry = () => {
            const pathData = getPathData([...ancestors, key]);
            const { instance, options } = pathData;
            // const { ref, refPath } = options;
            const reference =
              options?.ref ?? entrySelection?.[options?.refPath];

            // console.log({ ref, refPath });

            return instance === "ObjectID"
              ? arcanData.dependencies[reference][value]
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

  // :::::::::::::\ CANCEL DRAFT /:::::::::::::

  const cancelDraft = () => setDraftMode(null);

  // :::::::::::::\ FETCH ENTRY /:::::::::::::

  const fetchEntry = async entry_id => {
    try {
      const response = await axios.get(`/${selection}/${entry_id}`);
      console.log({ RESPONSE: response.data });
      draftMode && cancelDraft();
      setEntrySelection(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // :::::::::::::\ SELECT COLLECTION /:::::::::::::

  const selectCollection = name => {
    console.clear();
    draftMode && cancelDraft();
    setSelection(name);
    setEntrySelection("");
  };

  // :::::::::::::\ UPDATE ARCAN DATA /:::::::::::::

  const updateMaster = (newData, collection = selection) => {
    // setArcanData(prev => {
    //   const { _id, name, subtitle, title, username } = newData;

    //   const NAME =
    //     (typeof name === "object" ? name[Object.keys(name)[0]] : name) ??
    //     subtitle ??
    //     title ??
    //     username ??
    //     `${collection}: ${_id}`;

    //   return {
    //     ...prev,
    //     dependencies: {
    //       ...prev.dependencies,
    //       [collection]: { ...prev.dependencies[collection], [_id]: NAME },
    //     },
    //   };
    // });
    updateArcanData(newData, collection);
    setEntrySelection(newData);
  };

  // :::::::::::::\ ADD NEW ENTRY /:::::::::::::
  const addNew = () => {
    setEntrySelection(null);
    setDraftMode({
      schemaName: selection,
      arcanData,
      updateMaster,
    });
  };

  // :::::::::::::\ DELETE ENTRY /:::::::::::::
  const deleteEntry = async (id, collection = selection) => {
    try {
      const response = await axios.delete(`/${collection}/${id}`);
      if (response.status === 201) {
        setArcanData(prev => ({
          ...prev,
          dependencies: {
            ...prev.dependencies,
            [collection]: Object.fromEntries(
              Object.entries(prev.dependencies[collection]).filter(
                ([entryID]) => entryID !== id
              )
            ),
          },
        }));
        setEntrySelection(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <DBDraftProvider
      state={[
        selection,
        setSelection,
        entrySelection,
        setEntrySelection,
        draftMode,
        setDraftMode,
      ]}
    >
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
                  Entries:{" "}
                  {Object.keys(arcanData.dependencies[selection]).length}
                </div>
                <div>Filter</div>
              </div>
              <button className="add-new flex middle" onClick={addNew}>
                New
              </button>
            </div>

            {/* ------- ENTRY MENU ------- */}
            <Menu
              label="Entries"
              options={Object.keys(arcanData.dependencies[selection])}
              display={arcanData.dependencies[selection]}
              handleChange={entry => fetchEntry(entry)}
              id="collection-entry-list"
            />

            {/* ------- ENTRY DATA ------- */}
            <div id="entry-data" className="flex col">
              {entrySelection || draftMode ? (
                <>
                  <div id="entry-header" className="flex">
                    <div id="entry-title">
                      <h3
                        id="entry-name"
                        data-entry-id={entrySelection?._id ?? undefined}
                      >
                        {arcanData.dependencies[selection][
                          entrySelection?._id
                        ] ?? `New ${selection}`}
                      </h3>
                      {entrySelection?._id && (
                        <h4 id="entry-id">{entrySelection?._id}</h4>
                      )}
                    </div>
                    {!draftMode && (
                      <div className="button-cache">
                        <button
                          onClick={() =>
                            setDraftMode({
                              record: entrySelection,
                              recordName:
                                arcanData.dependencies[selection][
                                  entrySelection._id
                                ],
                              schemaName: selection,
                              arcanData,
                              updateArcanData,
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEntry(entrySelection?._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div id="entry-content-body" className="flex">
                    {draftMode ? (
                      <DatabaseDraft {...draftMode} cancel={cancelDraft} />
                    ) : (
                      // <div id="entry-fields" className="flex col">
                      //   {buildList(entrySelection)}
                      // </div>
                      <ObjectNest
                        dataObj={entrySelection}
                        collectionName={selection}
                        id="entry-fields"
                        className="flex col"
                      />
                    )}
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
    </DBDraftProvider>
  );
};

export default DatabaseView;
