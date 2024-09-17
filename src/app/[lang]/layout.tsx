import {JetBrains_Mono} from 'next/font/google';
import '../globals.css';
import type {Metadata} from 'next';
import {cn} from '@/lib/utils';
import {PHProvider} from '@/lib/providers/PHProvider';
import dynamic from 'next/dynamic';
import {jetbrains_mono, roboto} from './fonts';

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'GECO',
};

const PostHogPageView = dynamic(() => import('../../components/PostHogPageView'), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body className={cn(jetbrains_mono.variable, roboto.variable, '')}>
          <PostHogPageView />
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
