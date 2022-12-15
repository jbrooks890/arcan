import axios from "../../../apis/axios";
import "../../../styles/AddNew.css";
import { useState, useEffect } from "react";
import SelectBox from "../../form/SelectBox";
import Form from "../../form/Form";
import TextField from "../../form/TextField";
import Toggle from "../../form/Toggle";
import Menu from "../../form/Menu";

export default function AddNew() {
  const [models, setModels] = useState({});
  const [selection, setSelection] = useState();
  const [newEntry, setNewEntry] = useState({});

  const initEntry = entry => {
    const data = models[entry];
    // console.log(data);
    const { paths } = data;
    // console.log("paths:", paths);
    // setNewEntry(paths.map(field=> ))
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
              dataType = {};
              break;
          }
          return [field, defaultValue ? defaultValue : dataType];
        })
    );
    // console.log("fields", fields);
    setNewEntry();
  };

  useEffect(async () => {
    try {
      const response = await axios.get("/models");
      setModels(response.data);
      // initEntry();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // console.log({ selection });
  useEffect(() => selection && console.log(models[selection]), [selection]);

  // console.log(newEntry);

  const buildForm = () => {
    const { paths: fields } = models[selection];
    console.log(fields);

    return Object.keys(fields)
      .filter(
        field => !["_id", "createdAt", "updatedAt", "__v"].includes(field)
      )
      .map((field, key) => {
        // console.log({ field, label });
        const data = fields[field];
        const { isRequired: required, enumValues: options } = data;

        const createLabel = () => {
          let label = field.replace(/([A-Z])/g, " $1").toLowerCase();
          const shorthands = new Map([
            ["pref", "preference"],
            ["abb", "attribute"],
          ]);
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

        const props = {
          key,
          field,
          label,
          required,
        };

        if (options?.length) {
          return <SelectBox options={options} {...props} />;
        } else {
          switch (data.instance) {
            case "String":
              return <TextField {...props} />;
              break;
            case "Number":
              return (
                <label>
                  <span>{label}</span>
                  <input {...props} type="number" min={0} />
                </label>
              );
              break;
            case "Boolean":
              return <Toggle {...props} />;
              break;
            case "Array":
              // console.log(data.caster.instance);
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

  const handleSubmit = () => {};

  const handleChange = option => {
    setSelection(option);
    initEntry(option);
  };

  return (
    <div id="addNew" className="flex">
      {Object.keys(models).length ? (
        <>
          <Menu
            options={Object.keys(models)}
            label="create"
            handleChange={handleChange}
          />
          <Form className="flex col" autocomplete={false}>
            <h3>{selection}</h3>
            {/* <SelectBox options={Object.keys(models)} onChange={handleChange} /> */}
            {selection && buildForm()}
          </Form>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
