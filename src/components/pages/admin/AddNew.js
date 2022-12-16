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

export default function AddNew() {
  const [models, setModels] = useState({});
  const [selection, setSelection] = useState();
  const [newEntry, setNewEntry] = useState({});

  const initEntry = entry => {
    const data = models[entry];
    const { paths } = data;
    const fields = Object.fromEntries(
      Object.entries(paths)
        .filter(
          ([field]) => !["_id", "createdAt", "updatedAt", "__v"].includes(field)
        )
        .map(([field, data]) => {
          const { instance, defaultValue } = data;
          let dataType;
          switch (instance) {
            case "String":
              dataType = "";
              break;
            case "Number":
              dataType = 0;
              break;
            case "Boolean":
              dataType = false;
              break;
            case "Array":
              dataType = [];
              break;
            case "ObjectID":
              dataType = "0000000000";
              break;
          }
          return [field, defaultValue ? defaultValue : dataType];
        })
    );
    // console.log("fields", fields);
    setNewEntry(fields);
  };

  // :::::::::::::\ SELECT MODEL /:::::::::::::
  const selectModel = option => {
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

  // %%%%%%%%%%%%%\ BUILD FORM /%%%%%%%%%%%%%

  const buildForm = () => {
    const { paths: fields } = models[selection];
    console.log("fields:", fields);
    // console.log(
    //   Object.fromEntries(
    //     Object.entries(fields).filter(
    //       ([key, val]) => val.instance === "Array" && !val.caster?.instance
    //     )
    //   )
    // );

    return Object.keys(fields)
      .filter(
        field => !["_id", "createdAt", "updatedAt", "__v"].includes(field)
      )
      .map((field, key) => {
        const data = fields[field];
        const { isRequired: required, enumValues: options } = data;

        // ---------| HANDLE CHANGE |---------

        const handleChange = e => updateForm(field, e.currentTarget.value);

        // ---------| CREATE LABEL |---------

        const createLabel = () => {
          let label = field.replace(/([A-Z])/g, " $1").toLowerCase();
          const shorthands = new Map([
            ["pref", "preference"],
            ["attr", "attribute"],
          ]);
          shorthands.forEach((long, short) => {
            if (label.includes(short)) label = label.replace(short, long);
          });
          if (
            data.instance === "Array" &&
            label.charAt(label.length - 1) !== "s"
          )
            label += "(s)";
          if (label.split(" ")[0] === "is") label = label.slice(2) + "?";
          return label;
        };
        const label = createLabel();
        // options?.length && console.log(options);

        // console.log({ field, label });

        const props = {
          key,
          field,
          label,
          required,
          value: newEntry[field],
        };

        if (options?.length) {
          return (
            <SelectBox
              options={options}
              {...props}
              handleChange={entry => updateForm(field, entry)}
            />
          );
        } else {
          switch (data.instance) {
            case "String":
              return <TextField {...props} handleChange={handleChange} />;
              break;
            case "Number":
              return (
                <label {...key}>
                  <span>{label}</span>
                  <input
                    type="number"
                    min={0}
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
                  return (
                    <label {...props}>
                      <span>{label}</span>
                      <div>{`[{ ${options.ref} }]`}</div>
                    </label>
                  );
              }
              return (
                <label {...props}>
                  <span>{label}</span>
                  <div>[{field}]</div>
                </label>
              );

              break;
            case "ObjectID":
              const { ref } = data.options;
              return (
                <label {...props}>
                  <span>{label}</span>
                  <div>{`{ ${ref} }`}</div>
                </label>
              );
              break;
          }
        }
      });
  };

  // :::::::::::::\ HANDLE SUBMIT /:::::::::::::
  const handleSubmit = e => {
    e.preventDefault();
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
