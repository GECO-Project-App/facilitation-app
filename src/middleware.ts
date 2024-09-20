import createMiddleware from 'next-intl/middleware';
import Negotiator from 'negotiator';
import {match} from '@formatjs/intl-localematcher';
import {NextRequest, NextResponse} from 'next/server';
import {i18n} from './i18n';

const PUBLIC_FILE = /\.(.*)$/;
const cookieName = 'i18nlang';

function getLocale(request: NextRequest): string {
  // Kontrollera först om URL:en innehåller en giltig lokal
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameLocale) {
    console.log('Lokal hittad i URL:', pathnameLocale);
    return pathnameLocale;
  }

  // Sedan kontrollera cookien
  if (request.cookies.has(cookieName)) {
    const cookieLocale = request.cookies.get(cookieName)!.value;
    console.log('Lokal hittad i cookie:', cookieLocale);
    return cookieLocale;
  }

  // Fallback till Accept-Language header
  const acceptLang = request.headers.get('Accept-Language');
  if (!acceptLang) return i18n.defaultLocale;
  const headers = {'accept-language': acceptLang};
  const languages = new Negotiator({headers}).languages();
  const detectedLocale = match(languages, i18n.locales, i18n.defaultLocale);
  console.log('Lokal detekterad från Accept-Language:', detectedLocale);
  return detectedLocale;
}

const intlMiddleware = createMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
});

export default function middleware(request: NextRequest) {
  const locale = getLocale(request);

  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname === '/manifest.json' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/service-worker.js' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = i18n.locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
  );

  if (!pathnameHasLocale) {
    console.log('Omdirigerar till:', `/${locale}${pathname}`);
    const response = NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    response.cookies.set(cookieName, locale, {
      maxAge: 60 * 60 * 24 * 30, // 30 dagar
      path: '/',
    });
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
