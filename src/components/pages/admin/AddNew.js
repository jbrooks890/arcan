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

  useEffect(() => arcanData && console.log({ arcanData }), [arcanData]);

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
              ? undefined
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
    console.clear(); // TODO
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
    // console.log("%cUPDATE FORM:\n", "color:cyan", { field, entry });
    setNewEntry(prev => ({ ...prev, [field]: entry }));
  };

  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  // %%%%%%%%%%%%%%%%%%%%%%\ CREATE FIELDS /%%%%%%%%%%%%%%%%%%%%%%
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:

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

        // const { suggestions, enumRef } = options;
        // let choices = enumValues?.length
        //   ? enumValues
        //   : suggestions?.length && [...suggestions, "other"];

        const parent = ancestors[0];
        const chain = new Map();

        const set = ancestors.reduce((obj, prop) => {
          chain.set(prop, obj);

          return obj[prop];
        }, newEntry);

        // ---------| HANDLE CHANGE |---------

        const handleChange = value => {
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
          let label = str;
          if (/[a-z]/.test(label.charAt(0)))
            label = label.replace(/([A-Z])/g, " $1").toLowerCase();

          const shorthands = new Map([
            ["pref", "preference"],
            ["ref", "reference"],
            ["attr", "attribute"],
            ["org", "organization"],
            ["diffr", "differential"],
            ["intro", "introduction"],
            ["avg", "average"],
            ["dob", "date of birth"],
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
          if (label.startsWith("is ")) label = label.slice(2) + "?";
          return label;
        };
        const label = createLabel();
        const value = set?.[path] ?? defaultValue ?? enumValues?.[0];
        // createFormDefault(instance);

        const props = {
          key,
          field: path,
          label,
          required,
          value,
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

        // ---------| CREATE OBJECT ID BOX |---------

        const createObjIdBox = ({ ref, refPath }, single = true) => {
          const reference = refPath
            ? set?.[refPath] || paths[refPath].enumValues[0]
            : ref;
          const dependency = dependencies[reference];
          // console.log({ path, dependency });

          return (
            <ChoiceBox
              {...props}
              single={single}
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
        };

        // ===========================================
        const { suggestions, selfRef, enumRef } = options;
        const pathRef = enumRef ? set[enumRef] : [];

        let choices = enumValues?.length
          ? enumValues
          : suggestions?.length
          ? [...suggestions, "other"]
          : enumRef && pathRef;

        // enumRef && console.log({ path, choices });

        if (choices?.length) {
          if (selfRef) {
            choices = choices.filter(choice => {
              let fields = Object.keys(set);
              return typeof set?.[choice] === "object"
                ? Object.values(set[choice]).join(", ")
                : set?.[choice];
            });
          }

          // pathRef && console.log({ choices });

          const display = Object.fromEntries(
            choices
              .map(choice => {
                const value = set?.[choice];
                return [choice, pathRef && value ? value : createLabel(choice)];
              })
              .sort((a, b) => {
                // console.log({ previous: a[1], current: b[1] });
                return b[1] > a[1];
              })
          );

          // console.log({ display });

          const choiceProps = {
            ...props,
            options: required ? choices : ["", ...choices],
            display,
            handleChange: entry => handleChange(entry),
          };

          // selfRef && console.log({ display: choiceProps.display });

          return choices.length > 3 || !required ? (
            <SelectBox {...choiceProps} />
          ) : (
            <ChoiceBox {...choiceProps} />
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
                    value={set[path] ?? ""}
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
              // console.log("DATE:", set[path] instanceof Date);
              set[path] instanceof Date &&
                console.log("DATE:", set[path].toDateString());
              return (
                <label key={key}>
                  <span className={required ? "required" : ""}>{label}</span>
                  <input
                    type="date"
                    onChange={e => handleChange(e.currentTarget.value)}
                    // value={set[path].toDateString()}
                    value={set[path]}
                  />
                </label>
              );
              break;
            case "Array":
              const { schema, caster } = data;
              if (caster) {
                const { instance, options } = caster;
                if (instance === "String")
                  return (
                    <WordBank
                      {...props}
                      terms={set[path]}
                      update={entry => handleChange(entry)}
                    />
                  );
                if (instance === "ObjectID")
                  return createObjIdBox(caster.options, false);
              }
              if (schema) {
                const { paths } = schema;

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
                  options={options.enum}
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
              return createObjIdBox(options);
              break;
            default:
              if (options) {
                if (options?.type?.paths) {
                  return (
                    <FieldSet {...props} className="col">
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

  // :::::::::::::\ HANDLE RESET /:::::::::::::
  const handleReset = e => {
    e.preventDefault();
    console.clear();
    console.log(`%cFORM`, "color: lime");
    console.log(`New ${selection}:`, newEntry);
    console.log("%cJSON:", "color:cyan", JSON.stringify(newEntry));
  };

  // :::::::::::::\ HANDLE SUBMIT /:::::::::::::
  const handleSubmit = async e => {
    e.preventDefault();
    console.clear();
    // console.log(`%cSUBMIT`, "color: lime");
    // console.log(`New ${selection}:`, newEntry);
    try {
      const response = await axios.post("/" + selection, newEntry);
      initEntry(selection);
      response?.data &&
        setArcanData(prev => {
          const { _id, name, subtitle, title, username } = response.data;
          return {
            ...prev,
            dependencies: {
              ...prev.dependencies,
              [selection]: [
                ...prev.dependencies[selection],
                {
                  _id,
                  name:
                    name ??
                    subtitle ??
                    title ??
                    username ??
                    `${selection}: ${_id}`,
                },
              ],
            },
          };
        });
    } catch (err) {
      console.error(err.message);
      console.error(err.response.data.error.split(", ").join("\n"));
    }
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
            <div className="form-wrapper flex col">
              {selection && buildForm()}
              <ButtonCache>
                <button type="submit" onClick={e => handleSubmit(e)}>
                  Save
                </button>
                <button type="reset" onClick={e => handleReset(e)}>
                  Reset
                </button>
              </ButtonCache>
            </div>
          </Form>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
