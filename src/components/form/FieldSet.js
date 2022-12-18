const FieldSet = ({ label, fields }) => {
  // console.log(fields);
  return (
    <fieldset className="name-section wrapper flex">
      <legend>{label}</legend>
      {fields}
    </fieldset>
  );
};

export default FieldSet;
