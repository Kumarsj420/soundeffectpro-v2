"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { PreferencesProvider } from "./context/preferences-context";
import { LanguageProvider } from "./context/LanguageContext";

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

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <PreferencesProvider>
            {children}
          </PreferencesProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
