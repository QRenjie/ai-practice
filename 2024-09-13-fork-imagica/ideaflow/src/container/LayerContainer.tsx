import React, { useState, useMemo, useCallback, ReactNode } from 'react';
import Layer from '../components/Layer';
import ActiveLayerContext from '../context/ActiveLayerContext'; // 更新导入路径

interface LayerConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  size: { width: number; height: number };
}

interface LayerContainerProps {
  layers: LayerConfig[] | React.ReactNode;
}

const LayerContainer: React.FC<LayerContainerProps> = ({ layers }) => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const calculatePosition = useCallback((index: number) => {
    const offset = 30; // 每个新 Layer 的偏移量
    return { x: offset * index, y: offset * index };
  }, []);

  const layerElements = useMemo(() => {
    if (Array.isArray(layers)) {
      return layers.map((layer, index) => (
        <Layer
          key={layer.id}
          id={layer.id}
          initialSize={layer.size}
          initialPosition={calculatePosition(index)}
          title={layer.title}
        >
          {layer.content}
        </Layer>
      ));
    }
    return layers as ReactNode;
  }, [layers, calculatePosition]);

  return (
    <ActiveLayerContext.Provider value={{ activeLayer, setActiveLayer }}>
      <div className="relative w-full h-full">
        {layerElements}
      </div>
    </ActiveLayerContext.Provider>
  );
};

export default React.memo(LayerContainer);
