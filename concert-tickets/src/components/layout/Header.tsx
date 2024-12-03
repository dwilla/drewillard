import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-foreground text-background">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            DREWILLARD
          </Link>
          <div className="space-x-6">
            <Link 
              href="/concerts" 
              className="hover:opacity-80"
            >
              Upcoming Show
            </Link>
            <Link 
              href="/my-tickets" 
              className="hover:opacity-80"
            >
              My Tickets
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
