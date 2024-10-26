import { Button } from "@/components/ui/button"
import { KeyWordsChart } from "./components/tcc-related/key-words/keyword-chart"
import { ThemesChart } from "./components/tcc-related/themes/themes-chart"

export default function Home() {
  return (
    <main className="flex  w-full h-full justify-center flex-col gap-8 items-center min-h-[calc(100vh-68px)]">
      <KeyWordsChart />
      <ThemesChart />
    </main>
  )
}
