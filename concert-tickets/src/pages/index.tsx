import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-4xl font-bold">Welcome to my website homie!</h1>
      <p className="text-xl">You can buy tickets here and then I'll appreciate you but only slightly more than I already appreciate you.</p>
      <div className="space-x-4">
        <Link 
          href="/concerts" 
          className="inline-block bg-foreground text-background px-6 py-3 rounded-lg hover:opacity-90"
        >
          Get Tickies
        </Link>
      </div>
    </div>
  )
}
