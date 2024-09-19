import React, { createContext } from 'react';

interface ActiveLayerContextProps {
  activeLayer: string | null;
  setActiveLayer: (id: string | null) => void;
}

const ActiveLayerContext = createContext<ActiveLayerContextProps>({
  activeLayer: null,
  setActiveLayer: () => {},
});

export default ActiveLayerContext;