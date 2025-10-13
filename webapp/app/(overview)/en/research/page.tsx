import type { ResolvingMetadata, Metadata } from "next";
import { MetadataGenerator } from "@/app/lib/metadata";
import research_en from "@/app/site_data/research_en.md"
import { convertMarkdownToHtml } from "@/app/lib/markdown";
export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {   
    return MetadataGenerator(`Research`, `Research interests and projects of Dr. Kazuki Yamamoto`); 
}

export default async function Page() {
    const htmlContent = await convertMarkdownToHtml(research_en as string);
    return (
        <div className="m-2 p-2 prose">
            <div dangerouslySetInnerHTML={{ __html: htmlContent || "<p>Error loading content.</p>" }} />
        </div>
    );
}