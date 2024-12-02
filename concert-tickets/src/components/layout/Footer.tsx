export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p>© {new Date().getFullYear()} Concert Tickets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
