import {AppBar} from '@/components/AppBar';

export default async function TabsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children}
      <AppBar />
    </main>
  );
}
