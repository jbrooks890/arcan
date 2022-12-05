import { useContext, createContext, useState } from "react";

const StoryMode = createContext();
export const useStoryMode = () => useContext(StoryMode);

export default function StoryModeContext({ children }) {
  const [story, setStory] = useState("The Immortal Curse");
  return (
    <StoryMode.Provider value={{ story, setStory }}>
      {children}
    </StoryMode.Provider>
  );
}
