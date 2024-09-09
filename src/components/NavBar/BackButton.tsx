'use client';

import {Button} from '@/components';
import {ArrowLeft} from 'lucide-react';
import {usePathname, useRouter} from 'next/navigation';
import {FC} from 'react';

export const BackButton: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const hasHistory = pathname != '/';

  return (
    <button onClick={() => (hasHistory ? router.back() : null)} className="w-fit">
      {hasHistory && <ArrowLeft size={36} />}
    </button>
  );
};
