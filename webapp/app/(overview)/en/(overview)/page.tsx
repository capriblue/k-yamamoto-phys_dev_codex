import type { ResolvingMetadata, Metadata } from "next";
import Link from "next/link"
import { FaHome, FaSearch, FaBook } from 'react-icons/fa';
import { MetadataGenerator } from "@/app/lib/metadata";

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {
    return MetadataGenerator(`top page`, `top page(en)`);
}

export default async function Page() {
    return (
        <div className="m-2 p-2">
            <h1>Kazuki Yamamoto</h1>
            <p>Ph.D. (Science)</p>
            <p>Assistant Professor</p>
            <p>Department of Physics, School of Science, Tokyo University of Science (Formerly Tokyo Institute of Technology) (Koga Laboratory)</p>
            <p>Contact</p>
            <ul>
                <li>Email: yamamoto + atmark + phys.sci.isct.ac.jp </li>
            </ul> 
            This site is under construction: please check japanese version for the time being. 
            <Link href="/ja"><FaBook />TO Japanese SITE</Link>
        </div>
    );
}