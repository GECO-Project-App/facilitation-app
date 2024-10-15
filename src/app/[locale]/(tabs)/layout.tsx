import {TabBar} from '@/components';

export default async function TabsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children}
      <TabBar />
    </main>
  );
}
