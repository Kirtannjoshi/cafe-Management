import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, MapPin, Phone, Globe, Clock, FileText } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-6xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          
          <div className="mt-8">
            <Button asChild>
              <Link href="/">
                Return to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 border-t pt-8 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Looking for something else?</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link href="/menu" className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted/50">
                <FileText className="h-4 w-4 text-primary" />
                <span>Menu</span>
              </Link>
              
              <Link href="/tables" className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted/50">
                <Table className="h-4 w-4 text-primary" />
                <span>Tables</span>
              </Link>
              
              <Link href="/orders" className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted/50">
                <Clock className="h-4 w-4 text-primary" />
                <span>Orders</span>
              </Link>
              
              <Link href="/settings" className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted/50">
                <Globe className="h-4 w-4 text-primary" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}