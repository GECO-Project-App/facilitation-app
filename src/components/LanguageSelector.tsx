'use client';
import {usePathname, useRouter} from '@/i18n/routing';
import {cn} from '@/lib/utils';
import {useLocale, useTranslations} from 'next-intl';
import {useParams} from 'next/navigation';
import {FC, useMemo, useTransition} from 'react';
import {EnFlag, SvFlag} from './icons';
import {Select, SelectContent, SelectItem, SelectTrigger} from './ui';

type Language = {
  label: string;
  locale: string;
  flag: JSX.Element;
};

export const LanguageSelector: FC = () => {
  const t = useTranslations('common');
  const languages: Language[] = t.raw('languages').map((lang: Language) => lang);
  const currentLocale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const pathname = usePathname();

  const countries = useMemo(() => {
    return languages.map((lang) => {
      switch (lang.locale) {
        case 'en':
          return {
            value: lang.locale,
            label: lang.label,
            smFlag: <EnFlag />,
            lgFlag: <EnFlag height={36} width={36} strokeWidth={0.2} />,
          };
        case 'sv':
          return {
            value: lang.locale,
            label: lang.label,
            smFlag: <SvFlag />,
            lgFlag: <SvFlag height={36} width={36} strokeWidth={0.2} />,
          };
        default:
          return {
            value: lang.locale,
            label: lang.label,
            smFlag: <SvFlag />,
            lgFlag: <SvFlag height={36} width={36} strokeWidth={0.2} />,
          };
      }
    });
  }, [languages]);

  const switchLanguage = (selectedLocale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        {pathname, params},
        {locale: selectedLocale},
      );
    });
  };

  const selectedCountry = useMemo(() => {
    return countries.find((lang) => lang.value === currentLocale);
  }, [countries, currentLocale]);

  return (
    <Select
      defaultValue={countries.find((lang) => lang.value === currentLocale)?.value}
      onValueChange={switchLanguage}>
      <SelectTrigger className="w-[180px]">
        <div className="flex w-full items-center justify-between">
          <span className="bg-red-100 flex w-fit items-center gap-2 font-semibold">
            {selectedCountry?.smFlag} {selectedCountry?.label}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {countries.map((lang, index) => (
          <SelectItem
            value={lang.value}
            key={lang.value}
            className={cn(index < countries.length - 1 && 'border-b-2 border-black')}>
            <span className="flex items-center gap-2 font-semibold">
              {lang.lgFlag} {lang.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
