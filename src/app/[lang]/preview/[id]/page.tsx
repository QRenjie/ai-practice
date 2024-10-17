import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { WorkspaceEncrypt } from "@/utils/WorkspaceEncrypt";
import DynamicLoading from "@/components/DynamicLoading";
import { LocaleType } from "config/i18n";
import { getLocales } from "@/utils/getLocales";

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

export default async function PreviewPage({
  params: { lang, id },
  searchParams,
}: {
  params: { lang: LocaleType; id: string };
  searchParams: { data: string };
}) {
  if (!searchParams.data) {
    redirect("/404");
  }

  const locales = await getLocales(lang, "/preview");
  const workspace = WorkspaceEncrypt.decrypt(searchParams.data);

  console.log("jj workspace", id, searchParams.data, workspace);

  if (
    !searchParams.data ||
    !workspace ||
    !workspace.code ||
    !workspace.code.files
  ) {
    redirect("/404");
  }

  return <PreviewRoot content={workspace} localesValue={locales.toObject()} />;
}
