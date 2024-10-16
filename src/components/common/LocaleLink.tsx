import Link, { LinkProps } from "next/link";
import { i18n } from "config/i18n";
import { ReactNode } from "react";
import { UrlObject } from "url";

interface LocaleLinkProps extends Omit<LinkProps, 'href'> {
  href: string | UrlObject;
  locale?: string;
  children: ReactNode;
  className?: string;
}

const LocaleLink: React.FC<LocaleLinkProps> = ({
  href,
  locale,
  children,
  ...props
}) => {
  const isDefaultLocale = locale === i18n.defaultLocale;
  
  let localizedHref: string | UrlObject;
  if (typeof href === 'string') {
    localizedHref = isDefaultLocale ? href : `/${locale}${href}`;
  } else {
    localizedHref = {
      ...href,
      pathname: isDefaultLocale ? href.pathname : `/${locale}${href.pathname}`
    };
  }

  return (
    <Link {...props} href={localizedHref}>
      {children}
    </Link>
  );
};

export default LocaleLink;
