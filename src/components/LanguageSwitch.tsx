import Link from "next/link";

export const LanguageSwitcher = () => {
  return (
    <div>
      <Link href="/" locale="en">
        English
      </Link>
      <Link href="/" locale="sv">
        Swedish
      </Link>
      <Link href="/" locale="nl">
        Dutch
      </Link>
    </div>
  );
};
