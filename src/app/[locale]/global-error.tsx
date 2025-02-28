'use client'; // Error boundaries must be Client Components

import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';
export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const t = useTranslations('common');

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-svh h-full bg-red">
          <h2 className="text-2xl font-bold">{t('error.title')}</h2>
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }>
            {t('error.tryAgain')}
          </button>
          <Link href="/" className="hover:underline">
            <h2>{t('goBack')}</h2>
          </Link>
        </div>
      </body>
    </html>
  );
}
