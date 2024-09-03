import Link from "next/link";

export const LanguageSwitcher = () => {
  return (
    <div className="space-x-4">
      <Link href="/en" locale="en">
        English
      </Link>
      <Link href="/sv" locale="sv">
        Swedish
      </Link>
      <Link href="/nl" locale="nl">
        Dutch
      </Link>
    </div>
  );
};
