import { remark } from "remark";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Element } from "hast";

import remarkRehype from "remark-rehype";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";

export async function convertMarkdownToHtml(markdownString: string): Promise<string> {
    const processedContent = await remark()
        .use(remarkRehype) // Markdown → HTML AST に変換
        .use(rehypeExternalLinks, {
            target: "_blank",
            rel: ["nofollow", "noopener", "noreferrer"]
        })
        .use(rehyperImageWithCaption) // 画像にキャプションを追加
        .use(rehypeStringify) // HTML AST → HTML文字列に変換
        .process(markdownString);

    return processedContent.toString();
}

const rehyperImageWithCaption: Plugin<[], Root> = () => {
    return (tree) => {
        visit(tree, 'element', (node, index, parent) => {
            if (!parent || typeof index !== 'number') return;
            if (node.tagName !== 'img') return

            const alt = (node.properties?.alt as string) || '';

            const wrapper: Element = {
                type: "element", 
                tagName: "div",
                properties: {className: ["max-w-3/4", " mx-auto","not-prose", "my-4", "p-4", "bg-white", "shadow-sm", "rounded-md"]},
                children: [
                    {
                        type: "element",
                        tagName: "img",
                        properties: {
                            ...node.properties,
                            className: ["mb-0"]
                        },
                        children: []
                    },
                    alt ? {
                        type: "element",
                        tagName: "p",
                        properties: {className: ["mt-1 mb-0 text-center"]},
                        children: [{type: "text", value: alt}]
                    } : {type: "text", value: ""}
                ]
            }
            parent.children[index] = wrapper;
        })
    }
}