// src/context/MultiLoginContext.tsx
import { createContext, useContext } from "react";
import { useMultiLogin } from "../hooks/useMultiLogin";

const MultiLoginContext = createContext<ReturnType<
  typeof useMultiLogin
> | null>(null);

export const MultiLoginProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const multiLogin = useMultiLogin();
  return (
    <MultiLoginContext.Provider value={multiLogin}>
      {children}
    </MultiLoginContext.Provider>
  );
};

export const useMultiLoginContext = () => {
  const context = useContext(MultiLoginContext);
  if (!context)
    throw new Error(
      "useMultiLoginContext must be used within MultiLoginProvider"
    );
  return context;
};
