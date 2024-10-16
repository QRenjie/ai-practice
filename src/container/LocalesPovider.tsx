import { createContext, useContext } from "react";
import Locales from "@/utils/Locales";

export const LocalesContext = createContext<Locales | null>(null);

export default function LocalesProvider({
  children,
  locales,
}: {
  children: React.ReactNode;
  locales: Locales;
}) {
  return (
    <LocalesContext.Provider value={locales}>
      {children}
    </LocalesContext.Provider>
  );
}

export function useLocales() {
  const context = useContext(LocalesContext);
  if (!context) {
    throw new Error("useLocales must be used within a LocalesProvider");
  }
  return context;
}
