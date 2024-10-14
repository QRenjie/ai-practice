import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
  useRef,
} from "react";
import { LayerState } from "@/components/Layer";
import debounce from "lodash-es/debounce";
import ActiveLayerContext from "./ActiveLayerContext";
import { RndDragCallback, RndResizeCallback } from "react-rnd";

type Size = { width: number | string; height: number | string };

export interface LayerContextType
  extends Pick<
    LayerProps,
    "id" | "minWidth" | "title" | "disabled" | "className" | "onClose"
  > {
  state: LayerState;
  isAnimating: boolean;
  setSize: (size: Size) => void;
  setPosition: (position: { x: number; y: number }) => void;
  setIsMaximized: (isMaximized: boolean) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  handleMaximize: () => void;
  handleMinimize: () => void;
  handleFit: () => void;
  handleClick: () => void;
  handleDragStop: RndDragCallback;
  handleResize: RndResizeCallback;
  activeLayer: string | null;
  layerId: string;
  /**
   * 拖拽时，层级元素的类名
   */
  draggableHandleClassName: string;
}

export interface LayerProps {
  id?: string; // 将 id 属性变为可选
  children?: React.ReactNode;
  initialState: LayerState;
  minWidth?: number;
  minHeight?: number;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  className?: string;
  onClose?: () => void; // 新增
}

export const LayerContext = createContext<LayerContextType | null>(null);

// 静态计数器
let layerCounter = 0;

export const LayerProvider: React.FC<LayerProps> = ({
  initialState,
  id,
  minWidth,
  title,
  disabled,
  className,
  onClose,
  children,
}) => {
  const { activeLayer, setActiveLayer } = useContext(ActiveLayerContext);

  const [isAnimating, setIsAnimating] = useState(false);
  const [state, setState] = useState<LayerState>(initialState);

  // 使用 useRef 保存唯一 id
  const layerId = useRef(id || `layer-${layerCounter++}`).current;
  const draggableHandleClassName = useRef(
    `draggable-handle-layer-${layerId}`
  ).current;

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
    setTimeout(() => setIsAnimating(false), 300);

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
  ]);

  const handleMinimize = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

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
  ]);

  const handleFit = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

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
  ]);

  const handleClick = useCallback(() => {
    setActiveLayer(layerId);
  }, [setActiveLayer, layerId]);

  const handleDragStop: RndDragCallback = useCallback(
    (_, d) => {
      if (disabled) return;
      setPosition({ x: d.x, y: d.y });
    },
    [disabled, setPosition]
  );

  const handleResize: RndResizeCallback = useCallback(
    (_, __, ref, ___, position) => {
      if (disabled) return;
      setSize({
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      });
      setPosition({ x: position.x, y: position.y });
    },
    [disabled, setSize, setPosition]
  );

  const contextValue = useMemo(
    () => ({
      state,
      isAnimating,
      setSize,
      setPosition,
      setIsMaximized,
      setIsMinimized,
      handleMaximize,
      handleMinimize,
      handleFit,
      id,
      minWidth,
      title,
      disabled,
      className,
      onClose,
      handleClick,
      handleDragStop,
      handleResize,
      activeLayer,
      layerId,
      draggableHandleClassName,
    }),
    [
      state,
      isAnimating,
      setSize,
      setPosition,
      setIsMaximized,
      setIsMinimized,
      handleMaximize,
      handleMinimize,
      handleFit,
      id,
      minWidth,
      title,
      disabled,
      className,
      onClose,
      handleClick,
      handleDragStop,
      handleResize,
      activeLayer,
      layerId,
      draggableHandleClassName,
    ]
  );

  return (
    <LayerContext.Provider value={contextValue}>
      {children}
    </LayerContext.Provider>
  );
};
