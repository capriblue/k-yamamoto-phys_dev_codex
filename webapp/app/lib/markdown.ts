import { remark } from "remark";
import { visit } from "unist-util-visit";
import { unified, type Plugin } from "unified";
import type { Root, Element, RootContent, ElementContent } from "hast";
// import type { Root as mdRt, RootContent as mdRtC, Paragraph, Parent } from "mdast";
import remarkRehype from "remark-rehype";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
// import type { ContainerNode } from "./container-node";
import remarkParse from "remark-parse";
export async function convertMarkdownToHtml(markdownString: string): Promise<string> {
    const altParts = await extractAlts(markdownString); // 画像のalt部分を事前に抽出（remarkmathがparse前に動作して、alt内の数式ノーテーションを削除してしまうため）
    const processedContent = await remark()
        .use(remarkMath)
        .use(remarkRehype) // Markdown → HTML AST に変換
        .use(rehypeExternalLinks, {
            target: "_blank",
            rel: ["nofollow", "noopener", "noreferrer"]
        })
        .use(rehypeKatex) // 数式対応
        .use(rehyperImageWithCaption, { altData: altParts }) // 画像にキャプションを追加
        .use(rehyperh3Decorate) // h3をデコレート
        .use(rehypeStringify) // HTML AST → HTML文字列に変換
        .process(markdownString);

    return processedContent.toString();
}
export async function convertMarkdownToHtmlWithSectionize(markdownString: string): Promise<string> {
    const altParts = await extractAlts(markdownString); // 画像のalt部分を事前に抽出（remarkmathがparse前に動作して、alt内の数式ノーテーションを削除してしまうため）
    const processedContent = await remark()
        .use(remarkMath)
        .use(remarkRehype) // Markdown → HTML AST に変換
        .use(rehypeExternalLinks, {
            target: "_blank",
            rel: ["nofollow", "noopener", "noreferrer"]
        })
        .use(rehypeKatex) // 数式対応
        .use(rehyperImageWithCaption, { altData: altParts }) // 画像にキャプションを追加
        .use(rehyperh3Decorate) // h3をデコレート
        .use(rehypeSectionize) // セクション分割
        .use(rehypeStringify) // HTML AST → HTML文字列に変換
        .process(markdownString);

    return processedContent.toString();
}
const rehyperh3Decorate: Plugin<[], Root> = () => {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName !== 'h3') return;

            node.properties = {
                ...node.properties,
                className: ["my-2", "p-1", "border-l-4", "border-primary", "pl-2"]
            };
        })
    }
}

function isElement(node: RootContent): node is Element {
    return node.type === "element";
}
async function extractAlts(markdownText: string) {
    const tree = unified().use(remarkParse).parse(markdownText);
    const alts: Element[] = [];
    visit(tree, "image", (node: any) => {
        const processor = unified()
            .use(remarkParse)
            .use(remarkMath)
            .use(remarkRehype)
            .use(rehypeKatex);

        const mdast = processor.parse(node.alt || "");
        const hast = processor.runSync(mdast);
        if (!isElement(hast.children[0])) {
            return;
        }
        alts.push(hast.children[0]);
    });
    return alts;
}
// const remarkImageWithCaption: Plugin<[], mdRt> = () => {
//     return (tree) => {
//         visit(tree, "image", (node, index, parent) => {
//             if (!parent || typeof index !== 'number') return;
//             const alt = node.alt || "";
//             console.log(alt);
//             const caption: Paragraph = {
//                 type: "paragraph",
//                 children: [
//                     { type: "text", value: alt }
//                 ],
//                 data: {
//                     hProperties: { className: ["mt-1", "mb-0", "text-center"] },
//                     hName: "p",
//                 }
//             }
//             const wrapper: ContainerNode = {
//                 type: "container", 
//                 data: {
//                     hName: "div", 
//                     hProperties: { className: ["max-w-3/4", " mx-auto", "not-prose", "my-4", "p-4", "bg-white", "shadow-sm", "rounded-md"] },
//                 },
//                 children: [
//                     node,caption
//                 ]
//             }
//               parent.children[index] = wrapper;
//         })
//     }
// }      
const rehyperImageWithCaption: Plugin<[{ altData: Element[] }], Root> = (options) => {
    const { altData } = options || { altData: [] };
    let altIndex = 0;
    return (tree) => {
        visit(tree, 'element', (node, index, parent) => {
            if (!parent || typeof index !== 'number') return;
            if (node.tagName !== 'img') return;
            const wrapper: Element = {
                type: "element",
                tagName: "div",
                properties: { className: ["max-w-3/4", " mx-auto", "not-prose", "my-4", "p-4", "bg-white", "shadow-sm", "rounded-md"] },
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
                    altData[altIndex]
                ]
            }
            parent.children[index] = wrapper;
            altIndex++;
        })
    }
}
let sectionIndex = 0;

const rehypeSectionize: Plugin<[], Root> = () => {
    return (tree) => {
        const newChildren: RootContent[] = [];
        let currentSectionChildren: ElementContent[] = [];

        const pushSection = () => {
            const isEven = sectionIndex % 2 === 0; // 偶数なら true

            const bgClass = isEven ? "bg-gray-50" : "bg-blue-50";

            newChildren.push({
                type: "element",
                tagName: "section",
                properties: {
                    className: [
                        "w-screen",
                        "relative",
                        "left-1/2",
                        "right-1/2",
                        "ml-[-50vw]",
                        "mr-[-50vw]",
                        bgClass,
                    ],
                },
                children: [
                    {
                        type: "element",
                        tagName: "div",
                        properties: {
                            className: ["max-w-4xl", "mx-auto", "px-4", "py-1"],
                        },
                        children: currentSectionChildren,
                    },
                ],
            });

            sectionIndex++;
        };

        for (const node of tree.children) {
            if (node.type === "element" && node.tagName === "hr") {
                if (currentSectionChildren.length > 0) {
                    pushSection();
                    currentSectionChildren = [];
                }
            } else {
                if (node.type !== "doctype") {
                    currentSectionChildren.push(node);
                }
            }
        }

        // 最後に残った section を追加
        if (currentSectionChildren.length > 0) {
            pushSection();
        }

        tree.children = newChildren;
    };
};
