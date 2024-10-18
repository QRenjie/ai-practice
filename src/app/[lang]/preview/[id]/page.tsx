import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
// import { WorkspaceEncrypt } from "@/utils/WorkspaceEncrypt";
import DynamicLoading from "@/components/DynamicLoading";
// import DynamicLoading from "@/components/DynamicLoading";
import { LocaleType } from "config/i18n";
import { getLocales } from "@/utils/server/getLocales";
import { WorkspacePublishManager } from "@/utils/server/WorkspaceDataManager";
import { log } from "@/utils/log";

const PreviewRoot = dynamic(() => import("@/components/pages/PreviewRoot"), {
  loading: DynamicLoading,
});

// export const generateMetadata = async ({
//   params: { lang, id },
//   searchParams: { data },
// }: {
//   params: { lang: LocaleType; id: string };
//   searchParams: { data: string };
// }) => {
//   const locales = await getLocales(lang, "/preview");
//   const workspace = WorkspaceEncrypt.decrypt(data);

//   console.log("jj workspace", workspace);

//   if (!data || !workspace || !workspace.code || !workspace.code.files) {
//     redirect("/404");
//   }

//   return {
//     title: locales.format("seo.title", {
//       title: workspace.ui.title,
//     }),
//     description: locales.format("seo.description", {
//       description: workspace.ui.title,
//     }),
//   };
// };

const workspacePublishManager = new WorkspacePublishManager();
export default async function PreviewPage({
  params: { lang, id },
}: {
  params: { lang: LocaleType; id: string };
}) {
  const publishToken = id;

  const locales = await getLocales(lang, "/preview");
  const workspace = await workspacePublishManager.get(publishToken);

  log.debug(workspace);

  if (!workspace || !workspace.code || !workspace.code.files) {
    redirect("/404");
  }

  return <PreviewRoot content={workspace} localesValue={locales.toObject()} />;
}
