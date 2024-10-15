import {Toaster} from '@/components/ui/toast/toaster';
import {PHProvider} from '@/lib/providers/PHProvider';
import {cn} from '@/lib/utils';
import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import dynamic from 'next/dynamic';
import '../globals.css';
import {jetbrains_mono, roboto} from './fonts';

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'GECO',
};

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
      <html lang={locale}>
        <PHProvider>
          <body className={cn(jetbrains_mono.variable, roboto.variable, '')}>
            <PostHogPageView />
            {children}
            <Toaster />
          </body>
        </PHProvider>
      </html>
    </NextIntlClientProvider>
  );
}
