'use client';
import {useRouter} from '@/navigation';
import {useParams} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {FC, useMemo, useState, useTransition} from 'react';
import {Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue} from './ui';
import {cn} from '@/lib/utils';
import {EnFlag, SvFlag} from './icons';
import {ChevronDownIcon, ChevronUpIcon} from 'lucide-react';

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
  const [open, setOpen] = useState(false);

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

  const switchLanguage = (locale: string) => {
    startTransition(() => {
      router.replace(locale, params);
    });
  };

  const selectedCountry = useMemo(() => {
    return countries.find((lang) => lang.value === currentLocale);
  }, [countries, currentLocale]);

  return (
    <Select
      defaultValue={countries.find((lang) => lang.value === currentLocale)?.value}
      onValueChange={switchLanguage}
      onOpenChange={setOpen}>
      <SelectTrigger className="w-[180px]">
        <div className="flex w-full items-center justify-between">
          <span className="bg-red-100 flex w-fit items-center gap-2 font-semibold">
            {selectedCountry?.smFlag} {selectedCountry?.label}
          </span>
          <span className="w-fit transition-transform duration-200">
            {open ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {countries.map((lang, index) => (
          <SelectItem
            value={lang.value}
            key={lang.value}
            className={cn(
              index < countries.length - 1 && 'border-b-2 border-black',
              'data-[state=checked]:bg-pink',
            )}>
            <span className="flex items-center gap-2 font-semibold">
              {lang.lgFlag} {lang.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
