import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';
import {defaultLocale, locales} from './config';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: defaultLocale,
  localePrefix: 'always',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
