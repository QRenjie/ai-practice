import { LayerState } from "@/components/Layer";
import { useState, useCallback, useEffect } from "react";
import debounce from "lodash-es/debounce";

type Size = { width: number | string; height: number | string };

const DEFAULT_WIDTH = 800; // 默认宽度
const DEFAULT_HEIGHT = 600; // 默认高度

const useLayerPosition = (initialState: LayerState) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [state, setState] = useState<LayerState>(initialState);
  const [defaultSize, setDefaultSize] = useState<Size>({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });

  const setSize = useCallback((size: Size) => {
    setState((prevState) => ({ ...prevState, size }));
  }, []);

  const setPosition = useCallback((position: { x: number; y: number }) => {
    setState((prevState) => ({ ...prevState, position }));
  }, []);

  const setIsMaximized = useCallback((isMaximized: boolean) => {
    setState((prevState) => ({ ...prevState, isMaximized }));
  }, []);

  const setIsMinimized = useCallback((isMinimized: boolean) => {
    setState((prevState) => ({ ...prevState, isMinimized }));
  }, []);

  const setMaxSize = useCallback((maxSize: Size) => {
    setState((prevState) => ({ ...prevState, maxSize }));
  }, []);

  const calculateDefaultSize = useCallback(() => {
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    return {
      width: Math.min(DEFAULT_WIDTH, maxWidth),
      height: Math.min(DEFAULT_HEIGHT, maxHeight),
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSizes = () => {
        setMaxSize({ width: window.innerWidth, height: window.innerHeight });
        setDefaultSize(calculateDefaultSize());
        if (state.isMaximized) {
          setSize({ width: window.innerWidth, height: window.innerHeight });
          setPosition({ x: 0, y: 0 });
        }
      };

      const debouncedUpdateSizes = debounce(updateSizes, 80);

      updateSizes();

      window.addEventListener("resize", debouncedUpdateSizes);
      return () => window.removeEventListener("resize", debouncedUpdateSizes);
    }
  }, [
    state.isMaximized,
    setMaxSize,
    setSize,
    setPosition,
    calculateDefaultSize,
  ]);

  const handleMaximize = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (state.isMaximized) {
      setSize(defaultSize);
      setPosition({
        x: (window.innerWidth - (defaultSize.width as number)) / 2,
        y: (window.innerHeight - (defaultSize.height as number)) / 2,
      });
    } else {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!state.isMaximized);
    setIsMinimized(false);
  }, [
    state.isMaximized,
    defaultSize,
    setSize,
    setPosition,
    setIsMaximized,
    setIsMinimized,
  ]);

  const handleMinimize = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (state.isMinimized) {
      setSize(defaultSize);
    } else {
      setSize({ width: defaultSize.width, height: 40 });
    }
    setIsMinimized(!state.isMinimized);
    setIsMaximized(false);
  }, [state.isMinimized, defaultSize, setSize, setIsMinimized, setIsMaximized]);

  const handleFit = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    setSize(defaultSize);
    setPosition({
      x: (window.innerWidth - (defaultSize.width as number)) / 2,
      y: (window.innerHeight - (defaultSize.height as number)) / 2,
    });
    setIsMaximized(false);
    setIsMinimized(false);
  }, [defaultSize, setSize, setPosition, setIsMaximized, setIsMinimized]);

  return {
    size: state.size,
    position: state.position,
    isMaximized: state.isMaximized,
    isMinimized: state.isMinimized,
    isAnimating,
    maxSize: state.maxSize,
    setSize,
    setPosition,
    handleMaximize,
    handleMinimize,
    handleFit,
  };
};

export default useLayerPosition;
