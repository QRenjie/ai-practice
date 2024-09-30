import WorkspaceContext from "@/context/WorkspaceContext";
import { SandpackLayout, SandpackProvider } from "@codesandbox/sandpack-react";
import { useContext } from "react";

const WorkspaceSandpackWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state } = useContext(WorkspaceContext)!;

  console.log('jj state.code',state.code);
  
  return (
    <SandpackProvider
      className="h-full"
      style={{ height: "100%" }}
      files={state.code.files}
      customSetup={state.code.customSetup}
      template="react" // 将这里改为固定的 "react"
    >
      <SandpackLayout className="h-full w-full">{children}</SandpackLayout>
    </SandpackProvider>
  );
};

export default WorkspaceSandpackWrapper;
