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
    "id" | "title" | "disabled" | "className" | "onClose"
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
  activeLayer?: string;
  layerId: string;
  /**
   * 拖拽时，层级元素的类名
   */
  draggableHandleClassName: string;
  minSize: Size;
}

export interface LayerProps {
  id?: string; // 将 id 属性变为可选
  children?: React.ReactNode;
  initialState: LayerState;
  minSize?: Size;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  className?: string;
  onClose?: () => void; // 新增
}

export const LayerContext = createContext<LayerContextType | null>(null);

// 静态计数器
let layerCounter = 0;
const DEFAULT_MIN_SIZE = { width: 200, height: 40 };

export const LayerProvider: React.FC<LayerProps> = ({
  initialState,
  id,
  minSize,
  title,
  disabled,
  className,
  onClose,
  children,
}) => {
  const { activeLayer, setActiveLayer } = useContext(ActiveLayerContext);

  const [isAnimating, setIsAnimating] = useState(false);
  const [state, setState] = useState<LayerState>(initialState);

  const minSizeInner = useMemo(() => {
    return {
      width: minSize?.width || DEFAULT_MIN_SIZE.width,
      height: minSize?.height || DEFAULT_MIN_SIZE.height,
    };
  }, [minSize]);

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
      // 使用 minWidth 和 minHeight 设置最小尺寸
      setSize({
        width: minSizeInner?.width || initialState.size.width,
        height: minSizeInner?.height || 40, // 默认最小高度为40
      });
    }
    setIsMinimized(!state.isMinimized);
    setIsMaximized(false);
  }, [
    state.isMinimized,
    initialState.size,
    minSizeInner,
    setSize,
    setIsMinimized,
    setIsMaximized,
  ]);

  const handleFit = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // 获取当前窗口大小
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (state.isMaximized) {
      // 当全屏时，将尺寸设置为适应屏幕的大小，居中显示
      const margin = 50; // 设置一个边距
      const newWidth = windowWidth - 2 * margin;
      const newHeight = windowHeight - 2 * margin;

      setSize({ width: newWidth, height: newHeight });
      setPosition({
        x: margin,
        y: margin,
      });
    } else {
      // 当没有全屏时，窗口全屏
      setSize({ width: windowWidth, height: windowHeight });
      setPosition({ x: 0, y: 0 });
    }

    setIsMaximized(!state.isMaximized);
    setIsMinimized(false);
  }, [state.isMaximized, setSize, setPosition, setIsMaximized, setIsMinimized]);

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

  const disableInner = useMemo(() => {
    return (
      disabled ||
      state.isMaximized ||
      state.size.width === "100%" ||
      state.size.height === "100%"
    );
  }, [disabled, state.isMaximized, state.size.width, state.size.height]);

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
      minSize: minSizeInner,
      title,
      disabled: disableInner,
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
      minSizeInner,
      title,
      disableInner,
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
