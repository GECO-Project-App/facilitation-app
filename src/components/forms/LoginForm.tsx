'use client';
import {Link} from '@/i18n/routing';
import {login} from '@/lib/actions';
import {useTranslations} from 'next-intl';
import {useFormStatus} from 'react-dom';
import {Button, Input} from '../ui';

export const LoginForm = () => {
  const t = useTranslations('authenticate');
  const {pending} = useFormStatus();

  console.log(pending);
  return (
    <form className="h-fit min-h-[448px] flex flex-col justify-between">
      <div className="space-y-6 px-4">
        <div className="space-y-2">
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder={t('enterEmail')}
            required
            className="rounded-full h-12"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="login-password"
            name="password"
            type="password"
            placeholder={t('enterPassword')}
            required
            className="rounded-full h-12"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-4 text-sm text-green cursor-pointer hover:text-green/80">
            <Link href="./user/reset-password">{t('forgotPassword')}</Link>
          </div>
        </div>
      </div>
      <div className="mt-14 flex justify-center pb-6">
        <Button type="submit" disabled={pending} formAction={login}>
          {pending ? t('loading') : t('logIn')}
        </Button>
      </div>
    </form>
  );
};
