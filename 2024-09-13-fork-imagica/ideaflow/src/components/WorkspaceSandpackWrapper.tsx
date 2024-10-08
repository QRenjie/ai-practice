import WorkspaceContext from "@/context/WorkspaceContext";
import { SandpackLayout, SandpackProvider } from "@codesandbox/sandpack-react";
import { useContext } from "react";

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
      <SandpackLayout className="h-full w-full">{children}</SandpackLayout>
    </SandpackProvider>
  );
};

export default WorkspaceSandpackWrapper;
