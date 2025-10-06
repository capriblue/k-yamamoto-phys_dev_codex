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
           <h1>CV</h1>
           <p>プロフィール</p>
            <p>大阪府池田市出身、その後ドイツ→岡山→北海道→京都と進学と共に移動し、現在東京に至る。

                researchmap

                KAKEN</p>
            <h2>学歴</h2>
            <ul>
                <li>2020年4月 - 2023年3月     京都大学大学院理学研究科物理学・宇宙物理学専攻(物理学第一分野)博士後期課程 (指導教官: 川上則雄教授)</li>
                <li>2018年4月 - 2020年3月     京都大学大学院理学研究科物理学・宇宙物理学専攻(物理学第一分野)修士課程 (指導教官: 川上則雄教授)</li>
                <li>2014年4月 - 2018年3月     京都大学理学部</li>
            </ul>
            <h2>職歴</h2>
            基本的に変更があるのでymlでまとめる。
            <h4>(辞退)</h4>
            <ul>
                <li>2023年4月 - 2026年3月     理化学研究所 基礎科学特別研究員</li>
                <li>2023年4月 - 2026年3月     日本学術振興会特別研究員(PD)</li>
            </ul>
            <h2>受賞</h2>
            頻繁な変更があるのでymlでまとめる
            <h2>その他</h2>
            <p>TA(京大在籍時): 力学、課題研究Q11、物理学情報処理論2、統計力学A、統計力学演習2、量子力学演習1、電磁気学演習1</p>
            <p>全日本スキー連盟(SAJ) スキー検定: 一般2級, ジュニア1級</p>
            <p>サッカー(小学校1年生から現在まで、シュートとボールを遠くに飛ばすのが得意)、水泳(12歳まで、平泳ぎが得意(当時なぜかクロールより早かった))、バドミントン(中学校の部活)、ランニング(高校以降の趣味、10キロくらいよく週末か夜にその辺を走ってます)</p>
        </div>
    );
}