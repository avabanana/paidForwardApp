import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [age, setAge] = useState(null);

  return (
    <UserContext.Provider value={{ age, setAge }}>
      {children}
    </UserContext.Provider>
  );
}
