import { PreviewPublisher } from "../../../utils/PreviewPublisher";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import DynamicLoading from "@/components/DynamicLoading";

const PreviewRoot = dynamic(() => import("@/components/pages/PreviewRoot"), {
  loading: DynamicLoading,
});

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = searchParams.data as string;
  const content = PreviewPublisher.decryptWorkspaceState(data);

  if (!data || !content || !content.code || !content.code.files) {
    redirect("/404");
  }

  return <PreviewRoot content={content} />;
}
