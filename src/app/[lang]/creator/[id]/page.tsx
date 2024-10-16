import { notFound } from "next/navigation";
import { Metadata } from "next";
import DataGetter from "@/utils/DataGetter";
import LoadingSkeleton from "@/components/ssr/LoadingSkeleton";
import dynamic from "next/dynamic";
import { LocaleType } from "config/i18n";
import { getLocales } from "@/utils/getLocales";

const CreatorRoot = dynamic(() => import("@/components/pages/CreatorRoot"), {
  loading: LoadingSkeleton,
  ssr: false,
});

export async function generateMetadata({
  params,
}: {
  params: { id: string; lang: LocaleType };
}): Promise<Metadata> {
  const workspace = await DataGetter.getWorkspaceById(params.id);

  if (!workspace) {
    notFound();
  }

  return {
    title: `${workspace.ui.title} - 创作者页面`,
    description: `查看 ${workspace.ui.title} 的创作者页面和作品`,
  };
}

export default async function CreatorDetailPage({
  params,
}: {
  params: { id: string; lang: LocaleType };
}) {
  const locales = await getLocales(params.lang, "/creator");
  const workspace = await DataGetter.getWorkspaceById(params.id);

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
