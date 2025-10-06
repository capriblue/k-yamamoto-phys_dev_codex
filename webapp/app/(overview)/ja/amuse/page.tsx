import type { ResolvingMetadata, Metadata } from "next";
import Link from "next/link"
import { FaHome, FaSearch, FaBook } from 'react-icons/fa';
import { MetadataGenerator } from "@/app/lib/metadata";

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {   
    return MetadataGenerator(`top page`, `top page`); 
}

export default async function Page() {
    return (
        <div className="m-2 p-2">
           <h1>徒然なるままに</h1>       
           <p>弟子の日常、<a href="https://cond.scphys.kyoto-u.ac.jp/~norio/episode.html">本家はこちら</a></p>
        </div>
    );
}