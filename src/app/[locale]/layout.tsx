import {NextIntlClientProvider} from 'next-intl';
import '../globals.css';
import type {Metadata} from 'next';
import {cn} from '@/lib/utils';
import {PHProvider} from '@/lib/providers/PHProvider';
import dynamic from 'next/dynamic';
import {jetbrains_mono, roboto} from './fonts';
import {getMessages} from 'next-intl/server';
import AppBar from '@/components/Appbar';
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
            <AppBar />
            {children}
          </body>
        </PHProvider>
      </html>
    </NextIntlClientProvider>
  );
}
