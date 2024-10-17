import DataGetter from "@/utils/DataGetter";
import Tabs from "@/components/common/Tabs";
import WorkspacesGallery from "@/components/ssr/WorkspacesGallery";
import { getLocales } from "@/utils/getLocales";
import { LocaleType } from "config/i18n";
import LocaleLink from "@/components/common/LocaleLink";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const LanguageSwitcher = dynamic(
  () => import("@/components/LanguageSwitcher"),
  {
    ssr: false,
  }
);

// 定义一个异步函数来获取工作区数据
async function getWorkspaces() {
  const publicWorkspaces = DataGetter.getWorkspaces("public");
  const myWorkspaces = DataGetter.getWorkspaces("my");

  return {
    publicWorkspaces,
    myWorkspaces,
  };
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const locales = await getLocales(lang, "/");

  return {
    title: locales.t["seo.title"],
    description: locales.t["seo.description"],
  };
}

// 将 Home 组件保持为异步组件
export default async function Home({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  const locales = await getLocales(lang, "/");
  const t = locales.t;
  const { publicWorkspaces, myWorkspaces } = await getWorkspaces();

  const tabs = [
    {
      key: "public",
      label: t.public,
      children: <WorkspacesGallery workspaces={publicWorkspaces} />,
    },
    {
      key: "my",
      label: t.my,
      children: <WorkspacesGallery workspaces={myWorkspaces} />,
    },
  ];

  // 组件的其余部分保持不变
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row justify-between items-center py-4">
          <div className="text-2xl font-bold mb-4 sm:mb-0">{t.name}</div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <LanguageSwitcher />
            <LocaleLink href="/creator" locale={lang}>
              <button className="px-4 py-2 bg-black text-white rounded-full w-full sm:w-auto">
                {t.newGeneration}
              </button>
            </LocaleLink>
            <button className="w-full sm:w-auto">{t.feedback}</button>
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          </div>
        </header>

        <main className="py-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">{t.explore}</h1>
          <Tabs tabs={tabs} defaultActiveKey="public" />
        </main>

        <footer className="py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center sm:justify-start space-x-4 mb-4 sm:mb-0">
            <LocaleLink href="/faq" locale={lang}>
              {t.faq}
            </LocaleLink>
            <LocaleLink href="/terms" locale={lang}>
              {t.terms}
            </LocaleLink>
            <LocaleLink href="/ai-policy" locale={lang}>
              {t.aiPolicy}
            </LocaleLink>
            <LocaleLink href="/privacy" locale={lang}>
              {t.privacy}
            </LocaleLink>
          </div>
        </footer>
      </div>
    </div>
  );
}

// 添加 generateStaticParams 函数以启用静态生成
export async function generateStaticParams() {
  // 这里我们不需要生成任何动态路由参数，因为这是一个静态页面
  // 但是我们需要这个函数来触发静态生成
  return [];
}
