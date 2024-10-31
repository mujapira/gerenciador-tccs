import { Button } from "@/components/ui/button"
import { KeyWordsChart } from "./components/tcc-related/key-words/keyword-chart"
import { ThemesChart } from "./components/tcc-related/themes/themes-chart"
import { GradesChart } from "./components/tcc-related/gradesChart"
import { ClassificationChart } from "./components/tcc-related/classificationChart"

export default function Home() {
  return (
    <main className="flex  w-full h-full justify-center flex-col gap-8 items-center min-h-[calc(100vh-68px)]">
      <div className="flex gap-6">
        <div className="flex flex-col gap-6">
          <KeyWordsChart />
          <ThemesChart />
        </div>
        <div className="flex flex-col gap-6">
          <GradesChart />
          <ClassificationChart />
        </div>
      </div>
    </main>
  )
}
