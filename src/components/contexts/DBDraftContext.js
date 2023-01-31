import { createContext, useContext } from "react";

const DBDraft = createContext();
export const useDBDraft = () => useContext(DBDraft);

export default function DBDraftProvider({ state, children }) {
  return <DBDraft.Provider value={{ ...state }}>{children}</DBDraft.Provider>;
}
