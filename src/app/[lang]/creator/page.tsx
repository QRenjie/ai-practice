import { WorkspaceState } from "@/types/workspace";
import { workspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingSkeleton from "@/components/ssr/LoadingSkeleton";
import { getLocales } from "@/utils/server/getLocales";
import { LocaleType } from "config/i18n";
import { log } from "@/utils/log";

const CreatorRoot = dynamic(() => import("@/components/pages/CreatorRoot"), {
  loading: LoadingSkeleton,
  ssr: false,
});

export const generateMetadata = async ({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) => {
  const locales = await getLocales(lang, "/creator");

  return {
    title: locales.format("seo.title", {
      title: locales.get("workspace.meta.untitle"),
    }),
    description: locales.format("seo.description", {
      description: locales.get("workspace.meta.untitle"),
    }),
  };
};

export default async function Creator({
  params: { lang },
  searchParams,
}: {
  params: { lang: LocaleType };
  searchParams: { template?: string };
}) {
  const locales = await getLocales(lang, "/creator");

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
    log.warn("is not valid template:", workspaceType);
    notFound();
  }

  return (
    <div
      className="h-screen bg-gradient-to-r from-blue-100 to-blue-300 relative"
      data-testid="CreatorPage"
    >
      <CreatorRoot workspace={workspace} localesValue={locales.toObject()} />
    </div>
  );
}
