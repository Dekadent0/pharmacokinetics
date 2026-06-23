import { useState } from 'react'
import type { ReactNode } from 'react'
import { Beaker, FlaskConical, Sigma } from 'lucide-react'

type TabId = 'single' | 'multi' | 'math'

type MainLayoutProps = {
  singleDose: ReactNode
  multiDose: ReactNode
  mathPanel: ReactNode
}

const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
  {
    id: 'single',
    label: 'Одноразове введення',
    icon: <FlaskConical className="h-4 w-4" />,
  },
  {
    id: 'multi',
    label: 'Багаторазове введення',
    icon: <Beaker className="h-4 w-4" />,
  },
  {
    id: 'math',
    label: 'Рівняння',
    icon: <Sigma className="h-4 w-4" />,
  },
]

export function MainLayout({ singleDose, multiDose, mathPanel }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>('single')

  return (
    <main className="flex-1 overflow-y-auto bg-slate-100/80 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'single' && singleDose}
        {activeTab === 'multi' && multiDose}
        {activeTab === 'math' && mathPanel}
      </div>
    </main>
  )
}
