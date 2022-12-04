import { useContext, createContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}
