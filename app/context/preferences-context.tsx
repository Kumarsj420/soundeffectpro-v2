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


export type Theme = "light" | "dark" | "system";

type PreferencesState = {
  theme: Theme;
  nsfw: boolean;
  cookies: boolean;
};

type PreferencesContextType = {
  preferences: PreferencesState;
  setTheme: (theme: Theme) => void;
  setNSFW: (value: boolean) => void;
  setCookies: (value: boolean) => void;
};


const DEFAULT_PREFERENCES: PreferencesState = {
  theme: "system",
  nsfw: true,
  cookies: true,
};



const PreferencesContext = createContext<PreferencesContextType | null>(null);


function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeToDOM(theme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const resolved = theme === "system" ? getSystemTheme() : theme;

  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function normalizeTheme(value: unknown): Theme | null {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : null;
}


export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<PreferencesState>(DEFAULT_PREFERENCES);

  const { data: session, status } = useSession();


  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = localStorage.getItem("theme");
    const storedNSFW = localStorage.getItem("nsfw");
    const storedCookies = localStorage.getItem("cookies");

    setPreferences({
      theme: normalizeTheme(storedTheme) ?? "system",
      nsfw:
        storedNSFW !== null
          ? storedNSFW === "true"
          : DEFAULT_PREFERENCES.nsfw,
      cookies:
        storedCookies !== null
          ? storedCookies === "true"
          : DEFAULT_PREFERENCES.cookies,
    });
  }, []);


  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.preference) return;

    const db = session.user.preference;

    setPreferences((prev) => ({
      theme: normalizeTheme(db.theme) ?? prev.theme,
      nsfw: typeof db.nsfw === "boolean" ? db.nsfw : prev.nsfw,
      cookies: typeof db.cookies === "boolean" ? db.cookies : prev.cookies,
    }));
  }, [status, session]);

  useEffect(() => {
    applyThemeToDOM(preferences.theme);
  }, [preferences.theme]);



  useEffect(() => {
    if (preferences.theme !== "system") return;
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeToDOM("system");

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [preferences.theme]);



  useEffect(() => {

    if (preferences.cookies === true) {
      localStorage.setItem("theme", preferences.theme);
      localStorage.setItem("nsfw", String(preferences.nsfw));
    } else {
      localStorage.removeItem("theme");
      localStorage.removeItem("nsfw");
    }

    if (preferences.cookies === true) {
      localStorage.setItem("cookies", "true");
    } else {
      localStorage.removeItem("cookies");
    }
  }, [preferences.theme, preferences.nsfw, preferences.cookies]);



  const setTheme = (theme: Theme) =>
    setPreferences((p) => ({ ...p, theme }));

  const setNSFW = (value: boolean) =>
    setPreferences((p) => ({ ...p, nsfw: value }));

  const setCookies = (value: boolean) =>
    setPreferences((p) => ({ ...p, cookies: value }));

  const value = useMemo(
    () => ({
      preferences,
      setTheme,
      setNSFW,
      setCookies,
    }),
    [preferences]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}



function usePreferencesContext() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error(
      "Preferences hooks must be used inside <PreferencesProvider />"
    );
  }
  return ctx;
}



export function useTheme() {
  const { preferences, setTheme } = usePreferencesContext();
  return [preferences.theme, setTheme] as const;
}

export function useNSFW() {
  const { preferences, setNSFW } = usePreferencesContext();
  return [preferences.nsfw, setNSFW] as const;
}

export function useCookies() {
  const { preferences, setCookies } = usePreferencesContext();
  return [preferences.cookies, setCookies] as const;
}
