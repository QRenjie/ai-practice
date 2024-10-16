"use client";

import { FiGlobe } from "react-icons/fi";
import IconButton from "./common/IconButton";
import Popover from "./common/Popover";
import { usePathname } from "next/navigation";
import { i18n, LocaleType } from "config/i18n";
import Link from "next/link";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const redirectedPathname = (locale: LocaleType) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    console.log('jj segments',segments);
    
    if (segments[1] === i18n.defaultLocale) {
      console.log("jj redirectedPathname", segments);
      segments.filter((segment) => segment !== i18n.defaultLocale);
      return "/xxxxx"
    }
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <Popover
      content={
        <div>
          {i18n.locales.map((locale) => (
            <Link key={locale} href={redirectedPathname(locale)}>
              {locale}
            </Link>
          ))}
        </div>
      }
      trigger="click"
    >
      <IconButton icon={<FiGlobe />} />
    </Popover>
  );
}
