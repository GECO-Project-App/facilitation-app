import createMiddleware from 'next-intl/middleware';
import {defaultLocale, locales} from '../i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(sv|en)/:path*'],
};
