import WorkspaceContext from "@/container/WorkspaceContext";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { useCallback, useContext } from "react";
import SandpackContent from "../SandpackContent";
import { SandpackMessage } from "@codesandbox/sandpack-client";

const WorkspaceSandpackWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className, style }) => {
  const { state, controller } = useContext(WorkspaceContext)!;

  const onChangeMessage = useCallback(
    ({ type }: SandpackMessage) => {
      if (type === "done") {
        controller.updateConfig({ isSandpackLoading: false });
      }
    },
    [controller]
  );

  return (
    <SandpackProvider
      style={style}
      files={state.code.files}
      template={state.code.template || "static"}
      // customSetup={state.code.customSetup}
    >
      <SandpackContent className={className} onChangeMessage={onChangeMessage}>
        {children}
      </SandpackContent>
    </SandpackProvider>
  );
};

export default WorkspaceSandpackWrapper;
