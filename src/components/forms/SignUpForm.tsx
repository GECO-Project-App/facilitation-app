'use client';

import {signup} from '@/lib/actions';
import {useTranslations} from 'next-intl';
import {useFormStatus} from 'react-dom';
import {Button, Input} from '../ui';

export const SignUpForm = () => {
  const {pending} = useFormStatus();
  const t = useTranslations('authenticate');

  return (
    <form className="flex min-h-[448px] h-fit flex-col justify-between">
      <div className="space-y-4 px-4">
        <div className="space-y-2">
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder={t('enterEmail')}
            required
            className="h-12 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={t('enterPassword')}
            required
            className="h-12 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="signup-confirm-password"
            name="confirmPassword"
            autoComplete="new-password"
            type="password"
            placeholder={t('confirmPassword')}
            required
            className="h-12 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="first-name"
            name="firstName"
            type="text"
            placeholder={t('firstName')}
            className="h-12 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="last-name"
            name="lastName"
            type="text"
            placeholder={t('lastName')}
            className="h-12 rounded-full"
          />
        </div>
      </div>
      <div className="mt-14 flex justify-center pb-6">
        <Button type="submit" disabled={pending} formAction={signup}>
          {pending ? t('loading') : t('signUp')}
        </Button>
      </div>
    </form>
  );
};
