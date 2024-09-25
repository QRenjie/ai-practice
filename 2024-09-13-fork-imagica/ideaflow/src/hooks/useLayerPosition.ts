import { useState, useCallback } from "react";

type Size = { width: number | string; height: number | string };
const useLayerPosition = (
  initialSize: Size,
  initialPosition: { x: number; y: number }
) => {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [maxSize] = useState<Size>({
    width: "100%",
    height: "100%",
  });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const updateMaxSize = () => {
  //       setMaxSize({ width: window.innerWidth, height: window.innerHeight });
  //       if (isMaximized) {
  //         setSize({ width: window.innerWidth, height: window.innerHeight });
  //         setPosition({ x: 0, y: 0 });
  //       }
  //     };

  //     const debouncedUpdateMaxSize = debounce(updateMaxSize, 80);

  //     updateMaxSize();

  //     window.addEventListener("resize", debouncedUpdateMaxSize);
  //     return () => window.removeEventListener("resize", debouncedUpdateMaxSize);
  //   }
  // }, [isMaximized]);

  const handleMaximize = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // 动画持续时间

    if (isMaximized) {
      setSize(initialSize);
      setPosition(initialPosition);
    } else {
      setSize({ width: maxSize.width, height: maxSize.height });
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  }, [isMaximized, initialSize, initialPosition, maxSize]);

  const handleMinimize = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // 动画持续时间

    if (isMinimized) {
      setSize(initialSize);
    } else {
      setSize({ width: initialSize.width, height: 40 });
    }
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  }, [isMinimized, initialSize]);

  const handleFit = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // 动画持续时间

    setSize(initialSize);
    setPosition(initialPosition);
    setIsMaximized(false);
    setIsMinimized(false);
  }, [initialSize, initialPosition]);

  return {
    size,
    position,
    isMaximized,
    isMinimized,
    isAnimating,
    maxSize,
    setSize,
    setPosition,
    handleMaximize,
    handleMinimize,
    handleFit,
  };
};

export default useLayerPosition;
