import Head from 'next/head'

import { Canvas } from '../src/ui/canvas/canvas'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Clear Script</title>

        <meta content="Clear Script: Learn Clear Script" name="description" />

        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <h1>Clear Script (Todo-Bichig)</h1>

        <hr />

        <Canvas />
      </main>  
    </div>
  )
}
