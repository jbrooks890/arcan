import { useState } from "react";

const WordBank = ({ words }) => {
  const [bank, setBank] = useState([]);

  return (
    <label>
      <input type="text" />
      <ul>
        {words.map((word, i) => (
          <li key={i}>{word}</li>
        ))}
      </ul>
    </label>
  );
};

export default WordBank;
