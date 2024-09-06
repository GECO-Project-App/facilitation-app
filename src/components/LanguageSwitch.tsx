'use client';
import Link from 'next/link';
import {useRouter} from 'next/router';

export const LanguageSwitcher = () => {
  const router = useRouter();
  const {pathname, asPath, query} = router;

  return (
    <div className="space-x-4">
      <Link href={{pathname, query}} as={asPath} locale="en">
        English
      </Link>
      <Link href={{pathname, query}} as={asPath} locale="sv">
        Swedish
      </Link>
      <Link href={{pathname, query}} as={asPath} locale="nl">
        Dutch
      </Link>
    </div>
  );
};
