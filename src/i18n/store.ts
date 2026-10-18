import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Lang = 'en' | 'my';

function defaultLang(): Lang {
  try {
    return navigator.language?.toLowerCase().startsWith('my') ? 'my' : 'en';
  } catch {
    return 'en';
  }
}

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

/** The visitor's chosen language, remembered in this browser. */
export const useLang = create<LangState>()(
  persist(
    (set) => ({
      lang: defaultLang(),
      setLang: (lang) => set({ lang }),
    }),
    { name: 'royal.lang', storage: createJSONStorage(() => localStorage) },
  ),
);
