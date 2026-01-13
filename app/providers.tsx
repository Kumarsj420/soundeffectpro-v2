"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from 'next-auth/react';
import { ReactNode, useState, createContext, useContext } from "react";

type Lang = "en" | "hi" | "ar" | "ur" | "fr" | "de" | "es" | "pt" | "zh";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => { } });


export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const [lang, setLang] = useState<Lang>("en");

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageContext.Provider value={{ lang, setLang }}>
          {children}
        </LanguageContext.Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export const useLang = () => useContext(LanguageContext);