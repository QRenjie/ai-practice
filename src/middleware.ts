import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "../config/i18n";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string {
  if (i18n.forceDefaultLocale) {
    return i18n.defaultLocale;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-expect-error: i18n.locales 类型可能不匹配
  const locales: string[] = i18n.locales;

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  if (i18n.allowBrowserLanguageOverride) {
    const matchedLocale = matchLocale(languages, locales, i18n.defaultLocale);
    return matchedLocale;
  }

  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // 检查路径是否以语言代码开头
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // 对于所有语言，包括默认语言，都添加语言前缀
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    
    // 保留原始的查询参数
    searchParams.forEach((value, key) => {
      newUrl.searchParams.append(key, value);
    });

    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
