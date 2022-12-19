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
import DataSet from "../../form/DataSet";

export default function AddNew() {
  const [models, setModels] = useState({});
  const [selection, setSelection] = useState();
  const [newEntry, setNewEntry] = useState({});

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
          let dataType = () => {
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
              default:
                return createFormFields(path.options.type.paths);
            }
          };
          return [field, defaultValue ? defaultValue : dataType()];
        })
    );

  const initEntry = entry => {
    const data = models[entry];
    const { paths } = data;
    const fields = createFormFields(paths);
    // console.log("fields", fields);
    console.log("\ndata:", data);
    setNewEntry(fields);
  };

  // :::::::::::::\ SELECT MODEL /:::::::::::::
  const selectModel = option => {
    console.clear(); // TODO
    setSelection(option);
    initEntry(option);
  };

  useEffect(async () => {
    try {
      const response = await axios.get("/models");
      setModels(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(
    () => Object.keys(models).length && selectModel(Object.keys(models)[0]),
    [models]
  );

  // console.log({ selection });
  // useEffect(() => selection && console.log(models[selection]), [selection]);

  // %%%%%%%%%%%%%\ UPDATE FORM /%%%%%%%%%%%%%

  const updateForm = (field, entry) => {
    setNewEntry(prev => ({ ...prev, [field]: entry }));
  };

  // %%%%%%%%%%%\ CREATE FIELDS /%%%%%%%%%%%

  const createFields = (fields, parent) => {
    return Object.keys(fields)
      .filter(
        field =>
          !["_id", "createdAt", "updatedAt", "__v"].includes(field) &&
          !field.endsWith(".$*")
      )
      .map((field, key) => {
        const data = fields[field];
        const { isRequired: required, enumValues } = data;

        // ---------| HANDLE CHANGE |---------

        const handleChange = e => {
          const parentField = parent ? parent[field] : null;
          const { value } = e.currentTarget;

          console.log({ parent, field, parentField });

          return updateForm(field, value);
        };

        // ---------| CREATE LABEL |---------

        const createLabel = () => {
          let label = field.replace(/([A-Z])/g, " $1").toLowerCase();
          const shorthands = new Map([
            // ["pref", "preference"],
            ["attr", "attribute"],
          ]);
          shorthands.forEach((long, short) => {
            if (label.includes(short)) label = label.replace(short, long);
          });
          if (
            (data.instance === "Array" || data.instance === "Map") &&
            label.charAt(label.length - 1) !== "s"
          )
            label += "(s)";
          if (label.split(" ")[0] === "is") label = label.slice(2) + "?";
          return label;
        };
        const label = createLabel();

        const props = {
          key,
          field,
          label,
          required,
          value: newEntry[field],
        };

        if (enumValues?.length) {
          return enumValues.length > 3 ? (
            <SelectBox
              options={required ? enumValues : ["--", ...enumValues]}
              {...props}
              handleChange={entry => updateForm(field, entry)}
            />
          ) : (
            <ChoiceBox
              options={enumValues}
              {...props}
              handleChange={entry => updateForm(field, entry)}
            />
          );
        } else {
          switch (data.instance) {
            case "String":
              return field === "description" ? (
                <label {...key}>
                  <span className={required ? "required" : ""}>{label}</span>
                  <textarea
                    placeholder={`Description for ${selection}`}
                    onChange={handleChange}
                    rows={6}
                    value={newEntry[field]}
                  />
                </label>
              ) : (
                <TextField {...props} handleChange={handleChange} />
              );
              break;
            case "Number":
              return (
                <label {...key}>
                  <span>{label}</span>
                  <input
                    type="number"
                    min={data.options?.min ?? 0}
                    onChange={handleChange}
                    value={newEntry[field]}
                  />
                </label>
              );
              break;
            case "Boolean":
              return (
                <Toggle
                  {...props}
                  handleChange={e => updateForm(field, e.currentTarget.checked)}
                />
              );
              break;
            case "Date":
              return (
                <label {...key}>
                  <span>{label}</span>
                  <input
                    type="date"
                    onChange={handleChange}
                    value={newEntry[field]}
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
                      terms={newEntry[field]}
                      update={entry => {
                        console.log({ field, entry });
                        updateForm(field, entry);
                      }}
                    />
                  );
                if (instance === "ObjectID")
                  // NEEDS TO BE A MULTI CHOICE BOX OF DATABASE ENTRIES
                  return (
                    <ChoiceBox
                      options={[options.ref + " names"]}
                      single={false}
                      {...props}
                      // handleChange={entry => updateForm(field, entry)}
                    />
                  );
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
                  <DataSet
                    {...props}
                    single={false}
                    options={
                      primary.enumValues?.length ? primary.enumValues : null
                    }
                    primary={primary}
                    secondaries={
                      primary.enumValues?.length
                        ? createFields(secondaries, field)
                        : null
                    }
                  />
                );
              }
              return (
                <label {...props}>
                  <span>{label}</span>
                  <div>[{field}]</div>
                </label>
              );

              break;
            case "Map":
              const $data = fields[field + ".$*"];
              return (
                <DataSet
                  {...props}
                  single={false}
                  options={data.options.enum}
                  secondaries={createFields($data.options.type.paths, field)}
                />
              );
              break;
            case "ObjectID":
              // NEEDS TO BE A SINGLE CHOICE BOX OF DATABASE ENTRIES
              const { ref } = data.options;
              return (
                <ChoiceBox
                  options={[ref + " name"]}
                  {...props}
                  // handleChange={entry => updateForm(field, entry)}
                />
              );
              break;
            default:
              if (data.options) {
                if (data.options?.type?.paths) {
                  return (
                    <FieldSet {...props}>
                      {createFields(data.options.type.paths, field)}
                    </FieldSet>
                  );
                } else {
                  console.log({ field });
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
    const { paths } = models[selection];
    console.log("fields:", paths);

    return createFields(paths);
  };

  // :::::::::::::\ HANDLE SUBMIT /:::::::::::::
  const handleSubmit = e => {
    e.preventDefault();
    console.log(`%cSUBMIT`, "color: lime");
    console.log(`New ${selection}:`, newEntry);
  };

  // ============================================
  // :::::::::::::::::\ RENDER /:::::::::::::::::
  // ============================================

  return (
    <div id="addNew" className="flex">
      {Object.keys(models).length ? (
        <>
          <Menu
            options={Object.keys(models)}
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
