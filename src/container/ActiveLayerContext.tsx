import { createContext, Dispatch, SetStateAction, useState } from "react";

interface ActiveLayerContextProps {
  activeLayer?: string;
  setActiveLayer: Dispatch<SetStateAction<string | undefined>>;
}

const ActiveLayerContext = createContext<ActiveLayerContextProps>({
  activeLayer: undefined,
  setActiveLayer: () => {},
});

export default ActiveLayerContext;

export const ActiveLayerProvider: React.FC<{
  children: React.ReactNode;
  defaultActiveLayer?: string;
}> = ({ children: chidren, defaultActiveLayer }) => {
  const [activeLayer, setActiveLayer] = useState<string | undefined>(
    defaultActiveLayer
  );

  return (
    <ActiveLayerContext.Provider value={{ activeLayer, setActiveLayer }}>
      {chidren}
    </ActiveLayerContext.Provider>
  );
};
