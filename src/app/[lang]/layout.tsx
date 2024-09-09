import {JetBrains_Mono} from 'next/font/google';
import '../globals.css';
import type {Metadata} from 'next';
import {cn} from '@/lib/utils';

const jetbrains_mono = JetBrains_Mono({subsets: ['latin']});

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'Create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(jetbrains_mono.className, '')}>{children}</body>
    </html>
  );
}
