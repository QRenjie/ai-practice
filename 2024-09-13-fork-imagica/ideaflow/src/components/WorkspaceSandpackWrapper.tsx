import WorkspaceContext from "@/context/WorkspaceContext";
import {
  SandpackLayout,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useContext, useEffect } from "react";

const SandpackContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { sandpack } = useSandpack();
  const { updateConfig } = useContext(WorkspaceContext)!;

  useEffect(() => {
    // 当sandpack.status === "running"时，表示sandpack已经初始化完成
    if (sandpack.status === "running") {
      updateConfig({ isSandpackLoading: false });
    }
  }, [sandpack.status, updateConfig]);

  return <SandpackLayout className="h-full w-full">{children}</SandpackLayout>;
};

const WorkspaceSandpackWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state } = useContext(WorkspaceContext)!;

  return (
    <SandpackProvider
      className="h-full"
      style={{ height: "100%" }}
      files={state.code.files}
      customSetup={state.code.customSetup}
      template={state.code.template}
    >
      <SandpackContent>{children}</SandpackContent>
    </SandpackProvider>
  );
};

export default WorkspaceSandpackWrapper;
