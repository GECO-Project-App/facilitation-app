import React, {FC} from 'react';
import {Button} from './ui';
import {Home} from './icons';
import Link from 'next/link';

export const HomeButton: FC = () => {
  return (
    <Link href="/">
      <Button variant="ghost" size="ghost">
        <Home />
      </Button>
    </Link>
  );
};
