import { useRef, useState } from "react";
import Dropdown from "./Dropdown";

export default function TextBlock({ value, handleChange }) {
  const [previewMode, setPreviewMode] = useState(true);
  const textInput = useRef();

  const $DUMMY =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const INLINE = {
    bold: { symbol: "Bold", markdown: "**", tag: "strong" },
    italic: { symbol: "Italic", markdown: "*", tag: "em" },
    underline: { symbol: "Underline", markdown: "", tag: "u" },
  };
  const BLOCK = {
    headings: {
      h1: { symbol: "Heading 1", markdown: "#", tag: "h1" },
      h2: { symbol: "Heading 2", markdown: "##", tag: "h2" },
      h3: { symbol: "Heading 3", markdown: "#".repeat(3), tag: "h3" },
      h4: { symbol: "Heading 4", markdown: "#".repeat(4), tag: "h4" },
      h5: { symbol: "Heading 5", markdown: "#".repeat(5), tag: "h5" },
      h6: { symbol: "Heading 6", markdown: "#".repeat(6), tag: "h6" },
    },
  };

  const wrapSelection = () => {};

  const createFormatBtn = style => {
    const { symbol, markdown, tag: Tag } = INLINE[style];
    return (
      <button onClick={() => console.log(document.getSelection().toString())}>
        <Tag>{symbol}</Tag>
      </button>
    );
  };

  return (
    <div>
      <div className="format-tray flex middle">
        {Object.keys(INLINE).map(style => createFormatBtn(style))}
        <Dropdown
          options={"Heading 1; Heading 2; Heading 3; Heading 4; Heading 5; Heading 6".split(
            "; "
          )}
        />
      </div>
      <textarea
        ref={textInput}
        // placeholder={`Description for ${schemaName}`}
        spellCheck={true}
        onChange={handleChange}
        onSelect={e => console.log(window.getSelection())}
        rows={6}
        value={$DUMMY}
      />
    </div>
  );
}
