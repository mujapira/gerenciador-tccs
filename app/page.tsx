import { Button } from "@/components/ui/button"
import { KeyWordsChart } from "./components/charts/keyword-chart"
import { ThemesChart } from "./components/charts/themes-chart"
import { GradesChart } from "./components/charts/gradesChart"
import { ClassificationChart } from "./components/charts/classificationChart"

export default function Home() {
  return (
    <main className="flex w-full h-full justify-start flex-col gap-4 items-center p-4 min-h-[calc(100vh-68px)]">
      <span className="flex w-full items-center justify-start text-3xl font-bold">
        Gerenciador de TCCs da Fatec
      </span>
      <div className="flex gap-6 mt-8">
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
