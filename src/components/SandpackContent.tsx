"use client";

import { SandpackLayout, useSandpack } from "@codesandbox/sandpack-react";
import { SandpackMessage } from "@codesandbox/sandpack-client";
import { useEffect } from "react";

const SandpackContent: React.FC<{
  children: React.ReactNode;
  onChangeMessage?: (message: SandpackMessage) => void;
  className?: string;
}> = ({ children, onChangeMessage, className }) => {
  const { listen } = useSandpack();

  useEffect(() => {
    if (onChangeMessage) {
      const unsubscribe = listen(onChangeMessage);
      return () => unsubscribe();
    }
  }, [listen, onChangeMessage]);

  return <SandpackLayout className={className}>{children}</SandpackLayout>;
};

export default SandpackContent;
