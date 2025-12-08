import type { ResolvingMetadata, Metadata } from "next";
import Link from "next/link"
import { FaHome, FaSearch, FaBook } from 'react-icons/fa';
import { MetadataGenerator } from "@/app/lib/metadata";
import { convertMarkdownToHtml } from "@/app/lib/markdown"
import conference_data from "@/app/site_data/presentation.yml"
import dayjs from "dayjs";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import styles from "./presentations.module.css";
type Presentation = {
    title: string;
    presenter: string;
    date: Date;
    detail: string;
    type: "invited" | "seminar" | "talk" | "poster" | "other";
    isInternational: boolean;
}
const BadgeMap = {
    invited: "badge-warning",
    seminar: "badge-info",
    talk: "badge-success",
    poster: "badge-accent",
    other: "badge-natural"
}
export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {
    return MetadataGenerator(`Presentations`, `presentations by Dr. Kazuki Yamamoto`);
}

export default async function Page() {
    const conference_unsorted = conference_data as Presentation[];
    const conference = conference_unsorted.sort((a, b) => (a.date < b.date ? 1 : -1));
    const current = new Date();
    const upcoming = conference.filter(p => dayjs(p.date).isAfter(current)).sort((a, b) => (a.date < b.date ? -1 : 1));
    const others = conference.filter(p => p.type === "other" && dayjs(p.date).isBefore(current));
    return (
        <div className="m-2 p-2 prose">
            <h1>Presentations</h1>
            {
                upcoming.length > 0 && <>  <h2>Upcoming</h2>
                    <ul className="list-none">
                        {
                            upcoming.map((p, index, array) => (
                                <ConferenceItem key={index} p={p} number={array.length - index} />
                            ))
                        }
                    </ul></>
            }
            <CollapsibleSection title="International Conference (Invited)" info={conference.filter(p => p.isInternational && p.type === "invited" && dayjs(p.date).isBefore(current))} />
            <CollapsibleSection title="Domestic Conferences (Invited)" info={conference.filter(p => !p.isInternational && p.type === "invited" && dayjs(p.date).isBefore(current))} />
            <CollapsibleSection title="International Conferences (Oral Presentations)" info={conference.filter(p => p.isInternational && p.type === "talk" && dayjs(p.date).isBefore(current))} />
            <CollapsibleSection title="Domestic Conferences (Oral Presentations)" info={conference.filter(p => !p.isInternational && p.type === "talk" && dayjs(p.date).isBefore(current))} />
            <CollapsibleSection title="International Conferences (Poster Presentations)" info={conference.filter(p => p.isInternational && p.type === "poster" && dayjs(p.date).isBefore(current))} />
            <CollapsibleSection title="Domestic Conferences (Poster Presentations)" info={conference.filter(p => !p.isInternational && p.type === "poster" && dayjs(p.date).isBefore(current))} />
            <CollapsibleSection title="Seminars" info={conference.filter(p => p.type === "seminar" && dayjs(p.date).isBefore(current))} />
            <CollapsibleSection title="Other " info={conference.filter(p => p.type === "other" && dayjs(p.date).isBefore(current))} />

        </div>
    );
}
async function CollapsibleSection({ title, info }: { title: string; info: Presentation[]; }) {
    return (
        <>
            {info.length > 0 && (
                <details className="collapse bg-base-100">
                    <summary className="collapse-title p-0"><h2 className="border-b border-base-600 flex justify-between content-center"><div>{title}</div><IoIosArrowDown className={`inline-block my-auto ${styles.arrow}`} /></h2></summary>
                    <div className="collapse-content text-sm">
                        <ul className="list-none">
                            {
                                info.map((p, index, array) => (
                                    <ConferenceItem key={index} p={p} number={array.length - index} />
                                ))
                            }
                        </ul>
                    </div>
                </details>

            )}
        </>
    );
}
async function ConferenceItem({ p, number }: { p: Presentation, number: number }) {
    const badgeType = BadgeMap[p.type];
    const markdownContent = await convertMarkdownToHtml(p.detail);
    return (
        <li>
            <p>
                {number}.&nbsp;
                {/* <span className={`badge  badge-soft ${badgeType}`}>{p.type}</span> */}
                "{p.title}"
            </p>

            <p><UnderlinedText text={p.presenter} targets={[`Kazuki Yamamoto`, `山本 和樹`, `山本和樹`, `山本　和樹`]} /></p>
            <p dangerouslySetInnerHTML={{ __html: markdownContent || "" }} />
        </li>
    );
}

function UnderlinedText({
    text,
    targets,
}: {
    text: string;
    targets: string[];
}) {
    // 正規表現を動的に作る（大文字小文字区別あり）
    const regex = new RegExp(`(${targets.join("|")})`, "g");

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                targets.includes(part) ? (
                    <u key={i}>{part}</u>
                ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                )
            )}
        </>
    );
}
