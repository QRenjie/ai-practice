import { createContext, useContext } from "react";
import Locales, { LocaleType, PageRoutes, Translations } from "@/utils/Locales";

export const LocalesContext = createContext<Locales<
  LocaleType,
  PageRoutes
> | null>(null);

export default function LocalesProvider({
  children,
  namespace,
  locale,
  source,
}: {
  children: React.ReactNode;
  namespace: PageRoutes;
  locale: LocaleType;
  source: Translations;
}) {
  return (
    <LocalesContext.Provider value={new Locales(source, locale, namespace)}>
      {children}
    </LocalesContext.Provider>
  );
}

export function useLocales<Namespace extends PageRoutes>() {
  const context = useContext(LocalesContext);
  if (!context) {
    throw new Error("useLocales must be used within a LocalesProvider");
  }

  return {
    locales: context as Locales<LocaleType, Namespace>,
    t: context.t as Translations[Namespace],
  };
}
