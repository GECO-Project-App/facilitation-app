import { i18n } from "@/lib/i18n-config";
import "server-only";

const dictionaries = {
  sv: () => import("./dictionaries/sv.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  nl: () => import("./dictionaries/nl.json").then((module) => module.default),
};

export const getDictionary = async (locale) => dictionaries[locale]();
