import { notFound } from "next/navigation";
import { Metadata } from "next";
import LoadingSkeleton from "@/components/ssr/LoadingSkeleton";
import dynamic from "next/dynamic";
import { LocaleType } from "config/i18n";
import { getLocales } from "@/utils/getLocales";
import { WorkspaceSaveManager } from "@/utils/server/WorkspaceDataManager";

const CreatorRoot = dynamic(() => import("@/components/pages/CreatorRoot"), {
  loading: LoadingSkeleton,
  ssr: false,
});

const workspaceSaveManager = new WorkspaceSaveManager();

export async function generateMetadata({
  params: { lang, id },
}: {
  params: { id: string; lang: LocaleType };
}): Promise<Metadata> {
  const locales = await getLocales(lang, "/creator");

  const workspace = await workspaceSaveManager.getWorkspaceById(id);

  if (!workspace) {
    notFound();
  }

  return {
    title: locales.format("seo.title", {
      title: workspace.ui.title,
    }),
    description: locales.format("seo.description", {
      description: workspace.ui.title,
    }),
  };
}

export default async function CreatorDetailPage({
  params,
}: {
  params: { id: string; lang: LocaleType };
}) {
  const locales = await getLocales(params.lang, "/creator");
  const workspace = await workspaceSaveManager.getWorkspaceById(params.id);

  if (!workspace) {
    notFound();
  }

  return (
    <div
      className="h-screen bg-gradient-to-r overflow-hidden from-blue-100 to-blue-300 relative"
      data-testid="CreatorDetailPage"
    >
      <CreatorRoot workspace={workspace} localesValue={locales.toObject()} />
    </div>
  );
}
