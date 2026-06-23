import { useState } from 'react'
import { Header } from './components/Header'
import { MainLayout } from './components/MainLayout'
import { MathPanel } from './components/MathPanel'
import { MultiDose } from './components/MultiDose'
import { Sidebar } from './components/Sidebar'
import { SingleDose } from './components/SingleDose'
import { useSimulation, type SimulationParams } from './hooks/useSimulation'

const defaultParams: SimulationParams = {
  D: 500,
  ka: 1.2,
  ke: 0.25,
  Vd: 30,
  dt: 0.25,
  tau: 12,
}

export default function App() {
  const [params, setParams] = useState<SimulationParams>(defaultParams)
  const result = useSimulation(params)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col overflow-visible lg:flex-row">
        <Sidebar params={params} onChange={setParams} />
        <MainLayout
          singleDose={<SingleDose result={result} />}
          multiDose={<MultiDose tau={params.tau} result={result} />}
          mathPanel={<MathPanel />}
        />
      </div>
    </div>
  )
}
