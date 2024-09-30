import {FC, useMemo} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui';
import {useLocale, useTranslations} from 'next-intl';

export const LanguageSelector: FC = () => {
  const t = useTranslations('common');
  const languages: string[] = t.raw('languages').map((lang: string) => lang);
  const currentLocale = useLocale();

  const countries = useMemo(() => {
    return languages.map((lang) => {
      switch (lang) {
        case 'English':
          return {
            value: lang.toLowerCase(),
            label: `🇬🇧 ${lang}`,
          };
        case 'Svenska':
          return {
            value: lang.toLowerCase(),
            label: `🇸🇪 ${lang}`,
          };
        default:
          return {
            value: lang.toLowerCase(),
            label: lang,
          };
      }
    });
  }, [languages]);

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {countries.map((lang) => (
          <SelectItem value={lang.value} key={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
