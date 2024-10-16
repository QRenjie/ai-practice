import { WorkspaceState } from "@/types/workspace";
import { workspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingSkeleton from "@/components/ssr/LoadingSkeleton";

const CreatorRoot = dynamic(() => import("@/components/pages/CreatorRoot"), {
  loading: LoadingSkeleton,
  ssr: false,
});

export default async function Creator({
  searchParams,
}: {
  searchParams: { template?: string };
}) {
  let workspaceType = searchParams.template;
  let workspace: WorkspaceState | null = null;
  if (!workspaceType || !workspaceStateCreator.isTemplate(workspaceType)) {
    workspaceType = workspaceStateCreator.defaultKey;
  }

  if (workspaceStateCreator.isTemplate(workspaceType)) {
    workspace = workspaceStateCreator.create(workspaceType, {
      ui: { title: "Untitled" },
    });
  } else {
    console.warn("is not valid template:", workspaceType);
    notFound();
  }

  return (
    <div
      className="h-screen bg-gradient-to-r from-blue-100 to-blue-300 relative"
      data-testid="CreatorPage"
    >
      <CreatorRoot workspace={workspace} />
    </div>
  );
}
