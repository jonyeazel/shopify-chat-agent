'use client'
import Image from 'next/image'

export const TemplatePage = () => {
  return (
    <div className="flex min-h-screen items-start justify-center bg-black font-sans pt-[15vh]">
      <main className="flex w-full max-w-3xl flex-col gap-16 px-16">
        <Image
          className="invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col gap-4">
          <h1 className="max-w-md text-3xl font-semibold leading-10 tracking-tight text-zinc-50">
            Changes will appear here automatically.
          </h1>
          <p className="text-lg text-zinc-500">
            Tip: Try <span className="text-zinc-50">/</span> and <span className="text-zinc-50">@</span> in chat
          </p>
        </div>
      </main>
    </div>
  )
}
