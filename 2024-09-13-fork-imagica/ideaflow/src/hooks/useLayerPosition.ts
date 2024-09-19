import { useState, useEffect, useCallback } from "react";

const useLayerPosition = (initialSize: { width: number; height: number }, initialPosition: { x: number; y: number }) => {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [maxSize, setMaxSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setMaxSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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