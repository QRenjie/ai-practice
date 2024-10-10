import { notFound } from "next/navigation";
import { Metadata } from "next";
import DataGetter from "@/utils/DataGetter";
import { WorkspaceState } from "@/types/workspace";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const workspace = await DataGetter.getWorkspaceById(params.id);

  if (!workspace) {
    notFound();
  }

  return {
    title: `${workspace.name} - 创作者页面`,
    description: `查看 ${workspace.name} 的创作者页面和作品`,
  };
}

export default async function CreatorPage({ params }: { params: { id: string } }) {
  const workspace = await DataGetter.getWorkspaceById(params.id);

  if (!workspace) {
    notFound();
  }

  return (
    <div>
      <h1>{workspace.name}</h1>
      <p>创作者ID: {params.id}</p>
      <p>描述: {workspace.description}</p>
      {/* 根据WorkspaceState类型添加更多字段 */}
    </div>
  );
}
