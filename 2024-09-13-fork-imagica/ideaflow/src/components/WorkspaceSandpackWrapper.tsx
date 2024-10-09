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
  const { listen } = useSandpack();
  const { updateConfig } = useContext(WorkspaceContext)!;

  useEffect(() => {
    // connected stdout console resize done urlchange resize
    const subscription = listen(({ type }) => {
      console.log('jj type',type);
      
      if (type === "done") {
        updateConfig({ isSandpackLoading: false });
      }
    });
    return () => {
      subscription();
    };
  }, [listen, updateConfig]);

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
      // customSetup={state.code.customSetup}
      template={state.code.template || "static"}
    >
      <SandpackContent>{children}</SandpackContent>
    </SandpackProvider>
  );
};

export default WorkspaceSandpackWrapper;
