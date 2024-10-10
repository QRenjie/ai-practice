"use client";

import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import SandpackContent from "@/components/SandpackContent";
import { useCallback, useState } from "react";
import { SandpackMessage } from "@codesandbox/sandpack-client";
import { WorkspaceState } from "@/types/workspace";
import dynamic from "next/dynamic";
import DynamicLoading from "../DynamicLoading";

// 添加这个导入
import styles from "./PreviewRoot.module.css";

const WorkspaceLoadingSkeleton = dynamic(
  () => import("@/components/WorkspaceLoadingSkeleton"),
  {
    loading: DynamicLoading,
  }
);
export default function PreviewRoot({ content }: { content: WorkspaceState }) {
  const [loading, setLoading] = useState(true);

  const onChangeMessage = useCallback((message: SandpackMessage) => {
    if (message.type === "done") {
      setLoading(false);
    }
  }, []);

  return (
    <SandpackProvider
      files={content.code.files}
      customSetup={content.code.customSetup}
      template={content.code.template}
    >
      {loading && <WorkspaceLoadingSkeleton />}
      <SandpackContent
        onChangeMessage={onChangeMessage}
        className="w-full h-screen"
      >
        <SandpackPreview
          style={{ width: "100%", height: "100%" }}
          showOpenInCodeSandbox={false}
          showNavigator={false}
          showRestartButton={false}
          showRefreshButton={false}
          // 添加这个类名
          className={styles.hiddenAddress}
        />
      </SandpackContent>
    </SandpackProvider>
  );
}
