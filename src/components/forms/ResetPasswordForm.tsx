'use client';
import {RefreshCcw} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useFormStatus} from 'react-dom';
import {Button, Input} from '../ui';

export const ResetPasswordForm = () => {
  const {pending} = useFormStatus();
  const t = useTranslations('authenticate');
  return (
    <form className="mx-auto mt-10 flex h-fit min-h-[448px] max-w-[600px] flex-col justify-between">
      <div className="space-y-6 px-4">
        <h2 className="text-center text-2xl font-bold">{t('resetPassword')}</h2>
        <div className="space-y-2">
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder={t('enterEmail')}
            required
            className="h-12 rounded-full"
          />
        </div>
      </div>
      <div className="mt-14 flex justify-center pb-6">
        <Button type="submit" disabled={pending} variant="pink">
          {pending ? t('loading') : t('reset')} <RefreshCcw />
        </Button>
      </div>
    </form>
  );
};
