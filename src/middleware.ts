import {routing} from '@/i18n/routing';
import {updateSession} from '@/lib/supabase/middleware';
import createMiddleware from 'next-intl/middleware';
import {type NextRequest} from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  const publicRoutes = ['/settings/update-password'];

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return response;
  }

  // A `response` can now be passed here
  return await updateSession(request, response);
}

export const config = {
  matcher: ['/', '/(sv|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
