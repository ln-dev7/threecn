import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/site/footer"
import { PackageManagerProvider } from "@/lib/package-manager"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PackageManagerProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </PackageManagerProvider>
  )
}
