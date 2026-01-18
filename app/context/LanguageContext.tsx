"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";


export type Lang =
  | "en"
  | "hi"
  | "ar"
  | "ur"
  | "fr"
  | "de"
  | "es"
  | "pt"
  | "zh";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
};


const DEFAULT_LANG: Lang = "en";



const LanguageContext = createContext<LanguageContextType | null>(null);



function normalizeLang(value: unknown): Lang | null {
  const allowed: Lang[] = [
    "en",
    "hi",
    "ar",
    "ur",
    "fr",
    "de",
    "es",
    "pt",
    "zh",
  ];
  return allowed.includes(value as Lang) ? (value as Lang) : null;
}



export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const { data: session, status } = useSession();


  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("lang");
    setLangState(normalizeLang(stored) ?? DEFAULT_LANG);
  }, []);



  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.preference?.language) return;

    const dbLang = normalizeLang(session.user.preference.language);
    if (dbLang) setLangState(dbLang);
  }, [status, session]);



  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);


  const setLang = (l: Lang) => {
    setLangState(l);
  };

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}


export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used inside <LanguageProvider />");
  }
  return ctx;
}
