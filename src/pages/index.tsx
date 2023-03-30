import { Editor } from '@/components/editor'
import Head from 'next/head'
import { useState } from 'react'
import { nest } from "@pycabbage/tailwind-nest"

export default function Home() {
  const [editorValue, setEditorValue] = useState("")

  return (
    <>
      <Head>
        <title>Tailwind CSS Nest Syntax Demo</title>
        <meta name="description" content="Tailwind CSS Nest Syntax Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`
        dark:bg-gray-900 bg-gray-100 h-screen w-screen
        text-gray-900 dark:text-gray-100
        flex flex-col
        transition-[background-color]
      `}>
        <h1 className="text-2xl mx-6 my-4 font-extrabold font-sans">Tailwind CSS Nest Syntax Demo (React)</h1>
        <div className={`
        flex flex-grow
        `}>
          <div className={`w-1/2 m-2`}>
            <Editor
              language="plaintext"
              value={editorValue}
              onChange={v => setEditorValue(v ?? "")}
              className={`border-gray-500 border-2`}
            />
          </div>
          <div className={`w-1/2 m-2`}>
            <Editor
              language="plaintext"
              value={nest`${editorValue}`}
              options={{
                readOnly: true,
              }}
              className={`border-gray-500 border-2`}
            />
          </div>
        </div>
      </main>
    </>
  )
}
