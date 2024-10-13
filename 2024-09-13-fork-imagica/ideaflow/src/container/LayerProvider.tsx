import React, { useState } from "react";
import ActiveLayerContext from "./ActiveLayerContext"; // 更新导入路径

const LayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children: chidren,
}) => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <ActiveLayerContext.Provider value={{ activeLayer, setActiveLayer }}>
      {chidren}
    </ActiveLayerContext.Provider>
  );
};

export default React.memo(LayerProvider);
