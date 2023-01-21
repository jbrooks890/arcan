import "../../../styles/DBEntryDraft.css";
import axios from "../../../apis/axios";
import { useState, useEffect } from "react";
// import { useParams, useLocation } from "react-router-dom";
import Dropdown from "../../form/Dropdown";
import Form from "../../form/Form";
import TextField from "../../form/TextField";
import Toggle from "../../form/Toggle";
import WordBank from "../../form/WordBank";
import ButtonCache from "../../form/ButtonCache";
import ChoiceBox from "../../form/ChoiceBox";
import FieldSet from "../../form/FieldSet";
import DataSetEntry from "../../form/DataSetEntry";
import NumField from "../../form/NumField";
import ArraySet from "../../form/ArraySet";
import FormPreview from "../../form/FormPreview";

export default function DatabaseDraft({
  record,
  schemaName,
  arcanData,
  updateArcanData,
}) {
  const [entryMaster, setEntryMaster] = useState();
  const [entryData, setEntryData] = useState();
  const { models, dependencies } = arcanData;
  const SCHEMA = models[schemaName];

  // useEffect(() => console.log({ record, schemaName, arcanData }), []);
  // console.log({ record, schemaName, arcanData });
  // useEffect(() => entryData && console.log({ entryData }), [entryData]);
  useEffect(() => entryMaster && console.log({ entryMaster }), [entryMaster]);

  const initEntry = () => {
    const { paths } = SCHEMA;
    console.log();
    // const fields = createFormFields(paths);
    // console.log("\nPATHS:", paths);
    // setEntryData(fields);
  };

  // %%%%%%%%%%%%%%%%%%%%%%%\ UPDATE FORM /%%%%%%%%%%%%%%%%%%%%%%%

  const updateForm = (field, entry) => {
    // console.log("%cUPDATE FORM:\n", "color:cyan", { field, entry });
    setEntryData(prev => ({ ...prev, [field]: entry }));
  };

  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  // %%%%%%%%%%%%%%%%%%%%%%\ CREATE FIELDS /%%%%%%%%%%%%%%%%%%%%%%
  // :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:

  function createFields(paths, ancestors = []) {
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

        const getNestedValue = root =>
          ancestors.reduce((obj, path) => obj[path], root);

        const recordValue = record ? getNestedValue(record) : null;

        let label, element;
        let field =
          recordValue[path] ??
          defaultValue ??
          (required && enumValues ? enumValues[0] : undefined);

        // console.log({ path, recordValue, field });

        const parent = ancestors[0];

        // ---------| CREATE LABEL |---------

        const createLabel = (str = path) => {
          let label = str;
          if (/[a-z]/.test(label.charAt()))
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

        label = createLabel();

        const chain = entryData
          ? new Map(
              ancestors.reduce(
                (arr, path) => {
                  const parent = arr.pop();
                  const current = parent[path];
                  return [...arr, parent, current];
                },
                [entryData]
              )
            )
          : null;

        const set = getNestedValue(entryData ?? record);
        const value = set?.[path] ?? field;

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

        const props = {
          key,
          field: path,
          fieldPath: [...ancestors, path].join("-"),
          label,
          required,
          value,
        };

        // ---------| CREATE DATASET ENTRY |---------

        const createDataSetEntry = (paths, options, single = false) => {
          return (
            <DataSetEntry
              {...props}
              single={single}
              options={options}
              createFields={option =>
                createFields(paths, [...ancestors, path, option])
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
                    name ?? subtitle ?? title ?? `${schemaName}: ${_id}`,
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

          element =
            choices.length > 3 || !required ? (
              <Dropdown {...choiceProps} />
            ) : (
              <ChoiceBox {...choiceProps} />
            );
        } else {
          if (instance) {
            switch (instance) {
              case "String":
                element =
                  path === "description" ? (
                    <label key={key}>
                      <span className={required ? "required" : ""}>
                        {label}
                      </span>
                      <textarea
                        placeholder={`Description for ${schemaName}`}
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
                element = (
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
                if (record?.[path])
                  field = parseFloat(record[path].$numberDecimal);
                element = (
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
                element = (
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
                element = (
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
                    element = (
                      <WordBank
                        {...props}
                        terms={set?.[path] ?? recordValue[path]}
                        update={entry => handleChange(entry)}
                      />
                    );
                  if (instance === "ObjectID")
                    element = createObjIdBox(caster.options, false);
                }
                if (schema) {
                  const { paths } = schema;

                  element = (
                    <ArraySet
                      {...props}
                      createElements={index =>
                        createFields(paths, [...ancestors, path, index])
                      }
                      handleChange={handleChange}
                    />
                  );
                }
                // element = (
                //   <label key={key}>
                //     <span>{label}</span>
                //     <div>[{path}]</div>
                //   </label>
                // );

                break;
              case "Map":
                const $data = paths[path + ".$*"];
                // console.log($data.options.type.paths);
                element = createDataSetEntry(
                  $data.options.type.paths,
                  options.enum
                );

                break;
              case "ObjectID":
                element = createObjIdBox(options);
                break;
              default:
                console.warn(
                  `${path.toUpperCase()}: No handler for ${instance}`
                );
                element = (
                  <label key={key} {...props}>
                    <span>{label}</span>
                    <div>?</div>
                  </label>
                );
            }
          } else {
            if (options) {
              if (options.type?.paths) {
                const elements = createFields(options.type.paths, [
                  ...ancestors,
                  path,
                ]).map(entry => entry[1].element);
                console.log({ path, elements });

                element = (
                  <FieldSet {...props} className="col">
                    {elements}
                  </FieldSet>
                );
              } else {
                console.log({ path });
              }
            }
            // console.warn(`${path.toUpperCase()}: Unknown type!`);
            // element = (
            //   <label key={key}>
            //     <span>{label}</span>
            //     <div>?</div>
            //   </label>
            // );
          }
        }

        return [path, { field, label, instance, element }];
      });
  }

  // %%%%%%%%%%%%%\ BUILD FORM /%%%%%%%%%%%%%

  const buildForm = () => {
    const { paths } = SCHEMA;
    const DATA = createFields(paths);
    console.log({ DATA });

    if (!entryMaster) {
      setEntryMaster(Object.fromEntries(DATA));
      setEntryData(
        Object.fromEntries(
          DATA.map(([path, pathData]) => [path, pathData.field])
        )
      );
    }

    // console.log(createFields(paths));
    return DATA.map(entry => entry[1].element);
  };

  // :::::::::::::\ HANDLE RESET /:::::::::::::
  const handleReset = e => {
    e.preventDefault();
    console.clear();
    console.log(`%cFORM`, "color: lime");
    console.log(`New ${schemaName}:`, entryData);
    console.log("%cJSON:", "color:cyan", JSON.stringify(entryData));
  };

  // :::::::::::::\ HANDLE SUBMIT /:::::::::::::
  const handleSubmit = async e => {
    e.preventDefault();
    console.clear();
    try {
      const response = await axios.post("/" + schemaName, entryData);
      !record && initEntry(schemaName);
      response?.data && updateArcanData(response.data);
    } catch (err) {
      console.error(err.message);
      console.error(err.response.data.error.split(", ").join("\n"));
    }
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <div id="database-entry" className="flex">
      <Form className="flex col" autocomplete={false}>
        {/* <h3>{schemaName}</h3> */}
        <div className="form-wrapper flex col">
          {buildForm()}
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
      <FormPreview
        form={entryData}
        buttonText={record ? "Update" : "Submit"}
        handleSubmit={e => handleSubmit(e)}
      />
    </div>
  );
}
