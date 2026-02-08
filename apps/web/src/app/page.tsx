import Link from 'next/link'

export default function RootPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Link href="/fr">Go to App</Link>
    </div>
  )
}
