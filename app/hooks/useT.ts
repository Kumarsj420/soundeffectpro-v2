import { labels } from "../lib/labels";
import { useLang } from "../providers";

export const useT = () => {
    const { lang } = useLang();
    return (key: keyof typeof labels) => labels[key][lang];
};