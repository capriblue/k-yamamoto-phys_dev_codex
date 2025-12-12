'use client'

import { useAtom } from "jotai";
import { EngAtom } from "@/app/lib/atom"
import { redirect, usePathname, useRouter } from 'next/navigation';
import { siteMetadata } from "@/app/site_data/_metadata";
import { useEffect } from "react";

export const LangButton = () => {
    const [isEnglish, setIsEnglish] = useAtom(EngAtom);
    const currentPath = usePathname();
    if (siteMetadata.noEnglish.includes(currentPath)) return <></>;
    const locale = currentPath.split("/")[1];
    const router = useRouter();
    const lang = isEnglish ? "en" : "ja";
    if (locale === lang) {
        const newPath = lang === "en" ? currentPath.replace("/en", "/ja") : currentPath.replace("/ja", "/en");
        return <button className="btn" onClick={() => router.push(newPath)}>{lang === "en" ? "日本語" : "English"}</button>;
    } else {
        return <button className="btn" onClick={() => setIsEnglish(!isEnglish)}>{isEnglish ? "日本語" : "English"}</button>;
    }
}

