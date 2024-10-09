import WorkspaceContext from "@/context/WorkspaceContext";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { useCallback, useContext } from "react";
import SandpackContent from "./SandpackContent";
import { SandpackMessage } from "@codesandbox/sandpack-client";

const WorkspaceSandpackWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, updateConfig } = useContext(WorkspaceContext)!;

  const onChangeMessage = useCallback(
    ({ type }: SandpackMessage) => {
      console.log("jj type", type);
      if (type === "done") {
        updateConfig({ isSandpackLoading: false });
      }
    },
    [updateConfig]
  );

  return (
    <SandpackProvider
      className="h-full"
      style={{ height: "100%" }}
      files={state.code.files}
      // customSetup={state.code.customSetup}
      template={state.code.template || "static"}
    >
      <SandpackContent
        className="w-full h-full"
        onChangeMessage={onChangeMessage}
      >
        {children}
      </SandpackContent>
    </SandpackProvider>
  );
};

export default WorkspaceSandpackWrapper;
