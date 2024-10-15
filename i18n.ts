import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

export const locales = ['sv', 'en'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`/messages/${locale}.json`)).default,
  };
});
