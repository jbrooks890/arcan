import axios from "../../../apis/axios";
import "../../../styles/AddNew.css";
import { useState, useEffect } from "react";
import SelectBox from "../../form/SelectBox";
import Form from "../../form/Form";
import TextField from "../../form/TextField";
import Toggle from "../../form/Toggle";

export default function AddNew() {
  const [models, setModels] = useState({});
  const [selection, setSelection] = useState();
  const [newEntry, setNewEntry] = useState({});

  useEffect(async () => {
    try {
      const response = await axios.get("/models");
      setModels(response.data);
      setNewEntry(
        Object.fromEntries(
          Object.keys(response.data)
            .filter(
              field => !["_id", "createdAt", "updatedAt", "__v"].includes(field)
            )
            .map(field => [field, ""])
        )
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  // console.log({ selection });
  useEffect(() => selection && console.log(models[selection]), [selection]);

  console.log(newEntry);

  const buildForm = () => {
    const { paths: fields } = models[selection];
    console.log(fields);

    return Object.keys(fields)
      .filter(
        field => !["_id", "createdAt", "updatedAt", "__v"].includes(field)
      )
      .map((field, key) => {
        // console.log({ field, label });
        const label = field.replace(/([A-Z])/g, " $1").toLowerCase();
        const data = fields[field];
        const { isRequired: required, enumValues: options } = data;
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
              return (
                <label {...props}>
                  <span>{label}</span>
                  <div>{field}</div>
                </label>
              );
              break;
          }
        }
      });
  };

  const handleSubmit = () => {};

  const handleChange = option => setSelection(option);

  return (
    <div id="addNew" className="flex col middle">
      {Object.keys(models).length ? (
        <Form autocomplete={false}>
          <SelectBox options={Object.keys(models)} onChange={handleChange} />
          {selection && buildForm()}
        </Form>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
