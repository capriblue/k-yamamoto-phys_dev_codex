import type { ResolvingMetadata, Metadata } from "next";
import { MetadataGenerator } from "@/app/lib/metadata";
import research_ja from "@/app/site_data/research_ja.md"
import { convertMarkdownToHtml } from "@/app/lib/markdown";
export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {   
    return MetadataGenerator(`研究`, `研究の興味とプロジェクト`); 
}

export default async function Page() {
    const htmlContent = await convertMarkdownToHtml(research_ja as string);
    return (
        <div className="m-2 p-2 prose">
            <div dangerouslySetInnerHTML={{ __html: htmlContent || "<p>Error loading content.</p>" }} />
        </div>
    );
}\