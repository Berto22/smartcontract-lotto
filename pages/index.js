import Head from "next/head"
import Image from "next/image"
import EnterLotto from "../components/EnterLotto"
//import Header from "../components/Header";
import LottoHeader from "../components/LottoHeader"
import styles from "../styles/Home.module.css"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lotto</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LottoHeader />
            <EnterLotto />
        </div>
    )
}
