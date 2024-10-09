import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { PreviewPublisher } from "../../../utils/PreviewPublisher";
import { redirect } from 'next/navigation';

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = searchParams.data as string;
  
  if (!data) {
    redirect('/404');
  }

  let content;
  try {
    content = PreviewPublisher.decryptWorkspaceState(data);
  } catch (error) {
    console.error('解析预览数据失败:', error);
    redirect('/404');
  }

  if (!content || !content.code || !content.code.files || !content.code.template) {
    redirect('/404');
  }

  return (
    <SandpackProvider
      files={content.code.files}
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
