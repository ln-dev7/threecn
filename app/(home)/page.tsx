import { Hero } from "@/components/site/hero"
import { ScenesGrid } from "@/components/site/scenes-grid"
import { HowItWorks } from "@/components/site/how-it-works"
import { ThemeDemo } from "@/components/site/theme-demo"

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScenesGrid />
      <HowItWorks />
      <ThemeDemo />
    </>
  )
}
