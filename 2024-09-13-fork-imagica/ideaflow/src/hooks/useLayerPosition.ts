import { LayerState } from "@/components/Layer";
import { useState, useCallback, useEffect } from "react";
import debounce from "lodash-es/debounce";

type Size = { width: number | string; height: number | string };

const useLayerPosition = (initialState: LayerState) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [state, setState] = useState<LayerState>(initialState);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateMaxSize = () => {
        // 可能存在偏移，使用100%
        setMaxSize({ width: "100%", height: "100%" });
        if (state.isMaximized) {
          setSize({ width: window.innerWidth, height: window.innerHeight });
          setPosition({ x: 0, y: 0 });
        }
      };

      const debouncedUpdateMaxSize = debounce(updateMaxSize, 80);

      updateMaxSize();

      window.addEventListener("resize", debouncedUpdateMaxSize);
      return () => window.removeEventListener("resize", debouncedUpdateMaxSize);
    }
  }, [state.isMaximized, setMaxSize, setSize, setPosition]);

  const handleMaximize = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // 动画持续时间

    if (state.isMaximized) {
      setSize(initialState.size);
      setPosition(initialState.position);
    } else {
      setSize({ width: state.maxSize.width, height: state.maxSize.height });
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!state.isMaximized);
    setIsMinimized(false);
  }, [
    state.isMaximized,
    state.maxSize,
    initialState.size,
    initialState.position,
    setSize,
    setPosition,
    setIsMaximized,
    setIsMinimized,
    setIsAnimating,
  ]);

  const handleMinimize = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // 动画持续时间

    if (state.isMinimized) {
      setSize(initialState.size);
    } else {
      setSize({ width: initialState.size.width, height: 40 });
    }
    setIsMinimized(!state.isMinimized);
    setIsMaximized(false);
  }, [
    state.isMinimized,
    initialState.size,
    setSize,
    setIsMinimized,
    setIsMaximized,
    setIsAnimating,
  ]);

  const handleFit = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // 动画持续时间

    setSize(initialState.size);
    setPosition(initialState.position);
    setIsMaximized(false);
    setIsMinimized(false);
  }, [
    initialState.size,
    initialState.position,
    setSize,
    setPosition,
    setIsMaximized,
    setIsMinimized,
    setIsAnimating,
  ]);

  return {
    size: state.size,
    position: state.position,
    isMaximized: state.isMaximized,
    isMinimized: state.isMinimized,
    isAnimating: isAnimating,
    maxSize: state.maxSize,
    setSize,
    setPosition,
    handleMaximize,
    handleMinimize,
    handleFit,
  };
};

export default useLayerPosition;
