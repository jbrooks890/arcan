import React from "react";
import usePrompt from "../../../hooks/usePrompt";
import TextBlock from "../../form/TextBlock";
import Prompt from "../../frags/Prompt";

export default function Sandbox() {
  const { prompt } = usePrompt();
  return (
    <div>
      {/* <TextBlock /> */}
      {/* <button
        onClick={() =>
          prompt("Would you please test this prompt?", {
            "Of course": () => console.log("Splendid!"),
            No: () => console.log("Booo! You clicked No!"),
          })
        }
      >
        Test
      </button> */}
      <Prompt
        btnTxt="Test"
        message="Would you please test this prompt?"
        options={{
          "Of course": () => console.log("Splendid!"),
          No: () => console.log("Booo! You clicked No!"),
        }}
      />
    </div>
  );
}
