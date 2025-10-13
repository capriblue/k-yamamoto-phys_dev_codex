import type { Metadata } from "next";
// import { OGPheight, OGPwidth } from "./ogp_utility/createOGP" // 将来OGPを自動生成できるようにする。
import {siteMetadata} from "@/app/site_data/_metadata.js";
export const MetadataGenerator: (title: string, description: string, ogp_path?: string) => Metadata = (title, description, ogp_path = `${process.env.PUBLIC_URL}/ogp/other_page.png`) =>  {
    const OGPwidth = 1200;
    const OGPheight = 630;
    return {
    title: {
        absolute: `${title} | ${siteMetadata.name.en}`,
    },
    metadataBase: new URL(process.env.PUBLIC_URL as string),
    description: description,
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
        },
    },
    icons: {
        apple: 'favicons/apple-touch-icon.png',
        icon: '/favicons/icon.png',
        other: [{
            rel: "manifest", url: "/favicons/site.webmanifest"
        }, { rel: "mask-icon", url: "/favicons/safari-pinned-tab.svg" }],
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogp_path, // Must be an absolute URL
    },
    referrer: 'strict-origin-when-cross-origin',
        keywords: [siteMetadata.name.en, siteMetadata.name.ja, siteMetadata.organization.ja],
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: `${title} | ${siteMetadata.name.en}`,
        description: description,
        url: process.env.PUBLIC_URL,
        images: [
            {
                url: ogp_path, // Must be an absolute URL
                width: OGPwidth,
                height: OGPheight, 
            },
        ],
        type: 'website',
    },

}
}