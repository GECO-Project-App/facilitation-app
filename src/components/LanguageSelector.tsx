import Link from 'next/link';
import {FC} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui';

export const LanguageSelector: FC = () => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
};
