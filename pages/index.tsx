import Head from 'next/head'
import { Canvas } from '../src/ui/canvas/canvas'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Clear Script</title>
        <meta name="description" content="Clear Script: Learn Clear Script" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Clear Script</h1>
        <hr />
        <Canvas />
      </main>  
    </div>
  )
}
