'use client'

import { useAtom } from "jotai"; 
import { EngAtom } from "@/app/lib/atom"
import { usePathname, useRouter } from 'next/navigation';

export const LangButton = () => {
    const [isEnglish, setIsEnglish] = useAtom(EngAtom);
    const currentPath = usePathname();
    const locale = currentPath.split("/")[1];
    const router = useRouter();
    // console.log(locale, currentPath)
    const lang = isEnglish ? "en": "ja";
    if (locale === lang) {
        const newPath = lang === "en" ? currentPath.replace("/en", "/ja") : currentPath.replace("/ja", "/en");
        return <button className="btn"  onClick={() => router.push(newPath)}>{lang === "en" ? "日本語" : "English"}</button>;
    } else {
        return <></>;
    }
}

