import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { PreviewPublisher } from "../../../utils/PreviewPublisher";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = searchParams.data as string;
  const content = PreviewPublisher.decryptWorkspaceState(data);

  return (
    <SandpackProvider
      files={content.code.files}
      customSetup={content.code.customSetup}
      template={content.code.template}
    >
      <SandpackLayout className="w-full h-screen">
        <SandpackPreview
          style={{ width: "100%", height: "100%" }}
          showOpenInCodeSandbox={false}
          showNavigator={false}
          showRestartButton={false}
          showRefreshButton={false}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
}
