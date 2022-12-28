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

    // console.log({ schemata, dependencies });

    // setModels(schemata);
    setArcanData({ models, dependencies });
  };

  useEffect(async () => fetchModels(), []);

  // useEffect(
  //   () => Object.keys(arcanData).length && console.log(arcanData),
  //   [arcanData]
  // );

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

          return [
            field,
            defaultValue
              ? defaultValue
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
    console.clear(); // TODO
    setSelection(option);
    initEntry(option);
  };

  useEffect(
    () =>
      Object.keys(arcanData).length &&
      selectModel(Object.keys(arcanData.models)[0]),
    [arcanData.models]
  );

  // console.log({ selection });
  // useEffect(() => selection && console.log(models[selection]), [selection]);

  // %%%%%%%%%%%%%\ UPDATE FORM /%%%%%%%%%%%%%

  const updateForm = (field, entry) => {
    console.log("UPDATE FORM:", { field, entry });
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
          isRequired: required,
          defaultValue,
          enumValues,
        } = data;
        const parent = ancestors[0];

        let chain = {};

        // console.log({ path, ancestry: ancestors.join(".") });

        const set = ancestors.reduce((obj, prop) => {
          chain = { ...chain, [prop]: obj };

          return obj[prop];
        }, newEntry);

        // ---------| HANDLE CHANGE |---------

        const handleChange = value =>
          updateForm(
            parent ?? path,
            parent
              ? Object.entries(chain)
                  .slice(1) // EXCLUDE OVERALL FORM
                  .reduceRight(
                    (child, [path, parent]) => ({ ...parent, [path]: child }),
                    {
                      ...set,
                      [path]: value,
                    }
                  )
              : value
            // CHANGE HAS TO BE AT LOWEST LEVEL, RETURNED VALUE HAS TO BE AT HIGHEST LEVEL
          );

        // ---------| CREATE LABEL |---------

        const createLabel = () => {
          let label = path.replace(/([A-Z])/g, " $1").toLowerCase();
          const shorthands = new Map([
            // ["pref", "preference"],
            ["attr", "attribute"],
            ["org", "organization"],
            ["diffr", "differential"],
            ["intro", "introduction"],
            ["avg", "average"],
          ]);

          shorthands.forEach((long, short) => {
            if (label.includes(short)) label = label.replace(short, long);
          });
          if (parent && label.includes(parent))
            label = label.replace(parent, "").trim();
          if (
            (instance === "Array" || instance === "Map") &&
            label.charAt(label.length - 1) !== "s"
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

        if (enumValues?.length) {
          return enumValues.length > 3 || !required ? (
            <SelectBox
              options={required ? enumValues : ["", ...enumValues]}
              {...props}
              handleChange={entry => handleChange(entry)}
            />
          ) : (
            <ChoiceBox
              options={enumValues}
              {...props}
              handleChange={entry => handleChange(entry)}
            />
          );
        } else {
          switch (instance) {
            case "String":
              return path === "description" ? (
                <label {...key}>
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
                <label {...key}>
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
                      terms={newEntry[path]}
                      update={entry => {
                        console.log({ path, entry });
                        updateForm(path, entry);
                      }}
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
                          const { _id, name } = entry;
                          return [_id, name ?? "TEST"];
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
                  <DataSetEntry
                    {...props}
                    single={false}
                    options={
                      primary.enumValues?.length ? primary.enumValues : null
                    }
                    primary={primary}
                    secondaries={
                      primary.enumValues?.length
                        ? createFields(secondaries, path)
                        : null
                    }
                    createFormFields={createFormFields}
                  />
                );
              }
              return (
                <label {...props}>
                  <span>{label}</span>
                  <div>[{path}]</div>
                </label>
              );

              break;
            case "Map":
              const $data = paths[path + ".$*"];
              console.log($data.options.type.paths);

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
                      const { _id, name } = entry;
                      return [_id, name ?? "TEST"];
                    })
                  )}
                  handleChange={entry => handleChange(entry)}
                />
              );
              break;
            default:
              if (data.options) {
                if (data.options?.type?.paths) {
                  return (
                    <FieldSet {...props}>
                      {createFields(data.options.type.paths, [
                        ...ancestors,
                        path,
                      ])}
                    </FieldSet>
                  );
                } else {
                  console.log({ path });
                }
              }
              return (
                <label {...props}>
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
  const handleSubmit = e => {
    e.preventDefault();
    console.clear();
    console.log(`%cSUBMIT`, "color: lime");
    console.log(`New ${selection}:`, newEntry);
    // await axios.post("/" + selection);
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
