import { useRef, useState } from "react";
import "../../styles/form/Checkbox.css";

export default function Checkbox({ id, className, label, onChange, def }) {
  const input = useRef();
  const wrapper = useRef();

  return (
    <label className={`custom-checkbox ${className ?? ""}`} htmlFor={id}>
      <input
        ref={input}
        type="checkbox"
        id={id}
        // style={{ display: "none" }}
        onChange={onChange}
        checked={def}
      />
      <div className="checkmark flex center">
        <svg>
          <use href="#check-icon" />
        </svg>
      </div>
      <span className="label-text">{label}</span>
    </label>
  );
}
