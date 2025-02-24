import {Toaster} from '@/components/ui/toast/toaster';
import {AuthProvider} from '@/lib/providers/AuthProvider';
import {NotificationProvider} from '@/lib/providers/notifications/useNotification';
import {PHProvider} from '@/lib/providers/PHProvider';
import {cn} from '@/lib/utils';
import type {Metadata} from 'next';
import {Viewport} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import dynamic from 'next/dynamic';
import '../globals.css';
import {jetbrains_mono, roboto} from './fonts';

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'GECO',
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
};

export const revalidate = 0;
const PostHogPageView = dynamic(() => import('@/components/PostHogPageView'), {
  ssr: false,
});
export default async function RootLayout({
  children,
  params: {locale},
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <html lang={locale} suppressHydrationWarning>
        <AuthProvider>
          <PHProvider>
            <NotificationProvider>
              <body
                className={cn(jetbrains_mono.variable, roboto.variable, '')}
                suppressHydrationWarning>
                <PostHogPageView />
                {children}
                <Toaster />
              </body>
            </NotificationProvider>
          </PHProvider>
        </AuthProvider>
      </html>
    </NextIntlClientProvider>
  );
}
