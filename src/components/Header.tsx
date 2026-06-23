import { Activity } from 'lucide-react'

export function Header() {
  return (
    <header className="relative shrink-0 overflow-hidden border-b border-slate-800/20 bg-slate-900 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-cyan-600/20 to-indigo-700/30"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
          <Activity className="h-5 w-5 text-emerald-300" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Симулятор фармакокінетичної моделі
          </h1>
          <p className="mt-0.5 text-sm text-slate-300">
            Лише пероральне всмоктування
          </p>
        </div>
      </div>
    </header>
  )
}
