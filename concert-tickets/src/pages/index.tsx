import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-4xl font-bold">Welcome to Concert Tickets</h1>
      <p className="text-xl">Find and book tickets for your favorite concerts</p>
      <div className="space-x-4">
        <Link 
          href="/concerts" 
          className="inline-block bg-foreground text-background px-6 py-3 rounded-lg hover:opacity-90"
        >
          Browse Concerts
        </Link>
      </div>
    </div>
  )
}
