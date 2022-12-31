import axios from "../../../apis/axios";
import "../../../styles/AddNew.css";
import { useState, useEffect } from "react";
import SelectBox from "../../form/SelectBox";
import Form from "../../form/Form";
import TextField from "../../form/TextField";
import Toggle from "../../form/Toggle";
import Menu from "../../form/Menu";
import WordBank from "../../form/WordBank";
import ButtonCache from "../../form/ButtonCache";
import ChoiceBox from "../../form/ChoiceBox";
import FieldSet from "../../form/FieldSet";
import DataSetEntry from "../../form/DataSetEntry";
import NumField from "../../form/NumField";
import ArraySet from "../../form/ArraySet";

export default function AddNew() {
  // const [models, setModels] = useState({});
  const [arcanData, setArcanData] = useState({});
  const [selection, setSelection] = useState();
  const [newEntry, setNewEntry] = useState({});

  // :::::::::::::\ FETCH MODELS /:::::::::::::

  const fetchModels = async () => {
    const response = await axios.get("/models");
    console.log("DATA:", response.data);

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
  };

  useEffect(async () => fetchModels(), []);

  // :::::::::::::\ CREATE FORM FIELDS /:::::::::::::

  const createFormDefault = instance => {
    switch (instance) {
      case "String":
        return "";
        break;
      case "Number":
        return 0;
        break;
      case "Boolean":
        return false;
        break;
      case "Array":
        return [];
        break;
      case "Date":
        return new Date();
        break;
      case "Map":
        return {};
        break;
      case "ObjectID":
        return "< OBJECT ID >";
        break;
    }
  };

  const createFormFields = paths =>
    Object.fromEntries(
      Object.entries(paths)
        .filter(
          ([field]) =>
            !["_id", "createdAt", "updatedAt", "__v"].includes(field) &&
            !field.endsWith(".$*")
        )
        .map(([field, path]) => {
          const { instance, defaultValue } = path;
          const $default =
            instance !== "Array" ? defaultValue : path.options.default;

          return [
            field,
            $default
              ? $default
              : instance
              ? createFormDefault(instance)
              : createFormFields(path.options.type.paths),
          ];
        })
    );

  const initEntry = entry => {
    const data = arcanData.models[entry];
    const { paths } = data;
    const fields = createFormFields(paths);
    console.log("\nPATHS:", paths);
    setNewEntry(fields);
  };

  // :::::::::::::\ SELECT MODEL /:::::::::::::
  const selectModel = option => {
    // console.clear(); // TODO
    setSelection(option);
    initEntry(option);
  };

  useEffect(() => {
    Object.keys(arcanData).length &&
      selectModel(
        Object.keys(arcanData.models)[
          Object.keys(arcanData.models).indexOf("Character")
        ]
      );
  }, [arcanData.models]);

  // console.log({ selection });
  // useEffect(() => selection && console.log(models[selection]), [selection]);

  // %%%%%%%%%%%%%\ UPDATE FORM /%%%%%%%%%%%%%

  const updateForm = (field, entry) => {
    console.log("%cUPDATE FORM:%c\n", "color:cyan", { field, entry });
    setNewEntry(prev => ({ ...prev, [field]: entry }));
  };

  // %%%%%%%%%%%\ CREATE FIELDS /%%%%%%%%%%%

  const createFields = (paths, ancestors = []) => {
    const { dependencies } = arcanData;
    // console.log({ dependencies });

    return Object.entries(paths)
      .filter(
        ([path]) =>
          !["_id", "createdAt", "updatedAt", "__v"].includes(path) &&
          !path.endsWith(".$*")
      )
      .map(([path, data], key) => {
        const {
          instance,
          options,
          isRequired: required,
          defaultValue,
          enumValues,
        } = data;

        const { enum: $enum, suggestions } = options;
        const choices = enumValues ?? suggestions;

        // choices?.length && console.log({ path, choices });
        // suggestions && console.log({ path, suggestions });
        // $enum && console.log({ path, $enum });

        const parent = ancestors[0];
        const chain = new Map();

        const set = ancestors.reduce((obj, prop) => {
          chain.set(prop, obj);

          return obj[prop];
        }, newEntry);

        // ---------| HANDLE CHANGE |---------

        const handleChange = value => {
          console.log("%cCHAIN:\n", "color:lime", {
            path,
            chain,
          });
          updateForm(
            parent ?? path,
            parent
              ? // ? Object.entries(chain)
                [...chain.entries()]
                  .slice(1) // EXCLUDE OVERALL FORM
                  .reduceRight(
                    (val, [child, parent]) => {
                      parent[child] = val;

                      return parent;
                    },
                    {
                      ...set,
                      [path]: value,
                    }
                  )
              : value
            // CHANGE HAS TO BE AT LOWEST LEVEL, RETURNED VALUE HAS TO BE AT HIGHEST LEVEL
          );
        };

        // ---------| CREATE LABEL |---------

        const createLabel = (str = path) => {
          let label = str.replace(/([A-Z])/g, " $1").toLowerCase();
          const shorthands = new Map([
            ["pref", "preference"],
            ["attr", "attribute"],
            ["org", "organization"],
            ["diffr", "differential"],
            ["intro", "introduction"],
            ["avg", "average"],
          ]);
          const nonPlurals = ["s", "y"];

          shorthands.forEach((long, short) => {
            const regex = new RegExp(`\\b${short}\\b`);
            if (label.match(regex)) label = label.replace(regex, long);
          });
          if (parent && label.includes(parent))
            label = label.replace(parent, "").trim();
          if (
            (instance === "Array" || instance === "Map") &&
            !nonPlurals.includes(label.charAt(label.length - 1))
          )
            label += "(s)";
          if (label.split(" ")[0] === "is") label = label.slice(2) + "?";
          return label;
        };
        const label = createLabel();

        const props = {
          key,
          field: path,
          label,
          required,
          value:
            set?.[path] ??
            defaultValue ??
            enumValues?.[0] ??
            createFormDefault(instance),
        };

        // ---------| CREATE DATASET ENTRY |---------

        const createDataSetEntry = (single = false, options, secondaries) => {
          return (
            <DataSetEntry
              {...props}
              single={single}
              options={options}
              secondaryFormFields={createFormFields(secondaries)}
              createFields={option =>
                createFields(secondaries, [...ancestors, path, option])
              }
              handleChange={handleChange}
            />
          );
        };

        // ===========================================

        if (choices?.length) {
          const { selfRef } = options;
          // selfRef && console.log({ path, selfRef });
          // const fields = selfRef && Object.keys(set);
          // const selfRefOptions =
          //   selfRef &&
          //   enumValues
          //     .filter(entry =>
          //       fields.reduce((prev, curr) => {
          //         console.log({ prev, curr });
          //         return prev && entry.includes(curr);
          //       }, true)
          //     )
          //     .map(entry => {
          //       let newEntry = entry;
          //       fields.forEach(
          //         field => (newEntry = newEntry.replace(field, set[field]))
          //       );
          //       return { [entry]: newEntry.replaceAll(/\s{2}/g, " ").trim() };
          //     });
          // selfRef && console.log({ path, selfRefOptions });

          return choices.length > 3 || !required ? (
            <SelectBox
              {...props}
              options={required ? choices : ["", ...choices]}
              handleChange={entry => handleChange(entry)}
            />
          ) : (
            <ChoiceBox
              {...props}
              options={choices}
              handleChange={entry => handleChange(entry)}
            />
          );
        } else {
          switch (instance) {
            case "String":
              return path === "description" ? (
                <label key={key}>
                  <span className={required ? "required" : ""}>{label}</span>
                  <textarea
                    placeholder={`Description for ${selection}`}
                    onChange={e => handleChange(e.currentTarget.value)}
                    rows={6}
                    value={newEntry[path]}
                  />
                </label>
              ) : (
                <TextField
                  {...props}
                  handleChange={e => handleChange(e.currentTarget.value)}
                />
              );
              break;
            case "Number":
              return (
                <NumField
                  {...props}
                  min={data.options?.min}
                  max={data.options?.max}
                  handleChange={e =>
                    handleChange(parseInt(e.currentTarget.value))
                  }
                />
              );
              break;
            case "Decimal128":
              return (
                <NumField
                  {...props}
                  min={data.options?.min}
                  max={data.options?.max}
                  step={0.01}
                  handleChange={e =>
                    handleChange(parseFloat(e.currentTarget.value))
                  }
                />
              );
              break;
            case "Boolean":
              return (
                <Toggle
                  {...props}
                  handleChange={e => handleChange(e.currentTarget.checked)}
                />
              );
              break;
            case "Date":
              return (
                <label key={key}>
                  <span>{label}</span>
                  <input
                    type="date"
                    onChange={e => handleChange(e.currentTarget.value)}
                    value={newEntry[path]}
                  />
                </label>
              );
              break;
            case "Array":
              if (data.caster) {
                const { instance, options } = data.caster;
                if (instance === "String")
                  return (
                    <WordBank
                      {...props}
                      terms={set[path]}
                      update={entry => handleChange(entry)}
                    />
                  );
                if (instance === "ObjectID") {
                  // NEEDS TO BE A MULTI CHOICE BOX OF DATABASE ENTRIES

                  const { ref, refPath } = data.caster.options;
                  const reference = refPath
                    ? set?.[refPath] || paths[refPath].enumValues[0]
                    : ref;
                  const dependency = dependencies[reference];

                  return (
                    <ChoiceBox
                      {...props}
                      single={false}
                      options={dependency.map(entry => entry._id)}
                      display={Object.fromEntries(
                        dependency.map(entry => {
                          const { _id, name, title, subtitle } = entry;
                          return [
                            _id,
                            name ?? subtitle ?? title ?? `${selection}: ${_id}`,
                          ];
                        })
                      )}
                      handleChange={entry => handleChange(entry)}
                    />
                  );
                }
              }
              if (data.schema) {
                const { paths } = data.schema;
                const $primary = Object.keys(paths)[0];
                const primary = paths[$primary]; // "attribute" path
                const secondaries = Object.fromEntries(
                  Object.entries(paths).filter(([path]) => path !== $primary)
                );

                // console.log("primaries:", primaries);
                // console.log("secondaries:\n", secondaries);

                return (
                  <ArraySet
                    {...props}
                    createElements={index =>
                      createFields(paths, [...ancestors, path, index])
                    }
                    newEntry={createFormFields(paths)}
                    handleChange={handleChange}
                  />
                );
              }
              return (
                <label key={key} {...props}>
                  <span>{label}</span>
                  <div>[{path}]</div>
                </label>
              );

              break;
            case "Map":
              const $data = paths[path + ".$*"];
              // console.log($data.options.type.paths);

              return (
                <DataSetEntry
                  {...props}
                  single={false}
                  options={data.options.enum}
                  secondaryFormFields={createFormFields(
                    $data.options.type.paths
                  )}
                  createFields={option =>
                    createFields($data.options.type.paths, [
                      ...ancestors,
                      path,
                      option,
                    ])
                  }
                  handleChange={handleChange}
                />
              );
              break;
            case "ObjectID":
              // NEEDS TO BE A SINGLE CHOICE BOX OF DATABASE ENTRIES
              const { ref, refPath } = data.options;
              const reference = refPath
                ? set?.[refPath] || paths[refPath].enumValues[0]
                : ref;
              const dependency = dependencies[reference];

              return (
                <ChoiceBox
                  {...props}
                  options={dependency.map(entry => entry._id)}
                  display={Object.fromEntries(
                    dependency.map(entry => {
                      const { _id, name, title, subtitle } = entry;
                      return [
                        _id,
                        name ?? subtitle ?? title ?? `${selection}: ${_id}`,
                      ];
                    })
                  )}
                  handleChange={entry => handleChange(entry)}
                />
              );
              break;
            default:
              if (options) {
                if (options?.type?.paths) {
                  return (
                    <FieldSet {...props}>
                      {createFields(options.type.paths, [...ancestors, path])}
                    </FieldSet>
                  );
                } else {
                  console.log({ path });
                }
              }
              return (
                <label key={key} {...props}>
                  <span>{label}</span>
                  <div>?</div>
                </label>
              );
          }
        }
      });
  };

  // %%%%%%%%%%%%%\ BUILD FORM /%%%%%%%%%%%%%

  const buildForm = () => {
    const { paths } = arcanData.models[selection];
    // console.log("paths:", paths);

    return createFields(paths);
  };

  // :::::::::::::\ HANDLE SUBMIT /:::::::::::::
  const handleSubmit = async e => {
    e.preventDefault();
    console.clear();
    console.log(`%cSUBMIT`, "color: lime");
    console.log(`New ${selection}:`, newEntry);
    // try {
    //   await axios.post("/" + selection);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <div id="addNew" className="flex">
      {Object.keys(arcanData).length ? (
        <>
          <Menu
            options={Object.keys(arcanData.models)}
            label="create"
            handleChange={selectModel}
            value={selection}
          />
          <Form className="flex col" autocomplete={false}>
            <h3>{selection}</h3>
            {selection && buildForm()}
            <ButtonCache>
              <button type="submit" onClick={e => handleSubmit(e)}>
                Save
              </button>
              <button type="reset" onClick={e => e.preventDefault()}>
                Reset
              </button>
            </ButtonCache>
          </Form>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
