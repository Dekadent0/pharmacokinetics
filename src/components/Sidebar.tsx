import { CircleHelp, SlidersHorizontal } from 'lucide-react'
import type { SimulationParams } from '../hooks/useSimulation'

type SidebarProps = {
  params: SimulationParams
  onChange: (params: SimulationParams) => void
}

type SliderFieldProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  tooltip: string
  onChange: (value: number) => void
}

function HelpTooltip({ text }: { text: string }) {
  return (
    <span className="group/help relative inline-flex shrink-0 overflow-visible" tabIndex={0}>
      <CircleHelp className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover/help:text-emerald-600 group-focus-within/help:text-emerald-600" />
      <span
        role="tooltip"
        className="help-tooltip pointer-events-none absolute top-full right-0 z-[99] mt-1.5 w-52 rounded-md bg-slate-800 px-2.5 py-2 text-[11px] leading-snug text-white opacity-0 shadow-lg transition-opacity group-hover/help:opacity-100 group-focus-within/help:opacity-100"
      >
        {text}
      </span>
    </span>
  )
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  tooltip,
  onChange,
}: SliderFieldProps) {
  return (
    <label className="block overflow-visible rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-800">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-semibold text-emerald-700">
            {value} {unit}
          </span>
          <HelpTooltip text={tooltip} />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-emerald-600"
      />
    </label>
  )
}

export function Sidebar({ params, onChange }: SidebarProps) {
  const update = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    onChange({ ...params, [key]: value })
  }

  return (
    <aside className="relative z-20 w-full shrink-0 overflow-visible border-r border-slate-200 bg-slate-50 px-3 py-3 lg:w-80">
      <div className="mb-2 flex items-center gap-1.5 text-slate-700">
        <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
        <h2 className="text-xs font-semibold uppercase tracking-wide">Параметри моделі</h2>
      </div>

      <div className="space-y-1.5 overflow-visible">
        <SliderField
          label="Доза (D)"
          value={params.D}
          min={100}
          max={1000}
          step={10}
          unit="мг"
          tooltip="Загальна маса препарату, що вводиться за один пероральний прийом."
          onChange={(value) => update('D', value)}
        />
        <SliderField
          label="Шв. всмоктування (kₐ)"
          value={params.ka}
          min={0.1}
          max={4}
          step={0.1}
          unit="год⁻¹"
          tooltip="Константа швидкості першого порядку для переходу препарату з ШКТ у кров."
          onChange={(value) => update('ka', value)}
        />
        <SliderField
          label="Шв. елімінації (kₑ)"
          value={params.ke}
          min={0.05}
          max={1.5}
          step={0.05}
          unit="год⁻¹"
          tooltip="Константа швидкості елімінації препарату з центрального компартменту."
          onChange={(value) => update('ke', value)}
        />
        <SliderField
          label="Об'єм розподілу (Vᵈ)"
          value={params.Vd}
          min={5}
          max={50}
          step={1}
          unit="л"
          tooltip="Умовний об'єм, у якому препарат розподіляється при рівновазі."
          onChange={(value) => update('Vd', value)}
        />
        <div className="border-t border-slate-200" role="separator" aria-hidden />
        <SliderField
          label="Крок обчислень (Δt)"
          value={params.dt}
          min={0.05}
          max={1.5}
          step={0.05}
          unit="год"
          tooltip="Крок інтегрування для методів Ейлера та Рунге—Кутти. Менший крок підвищує точність."
          onChange={(value) => update('dt', value)}
        />
        <SliderField
          label="Інтервал доз (τ)"
          value={params.tau}
          min={4}
          max={24}
          step={1}
          unit="год"
          tooltip="Час між повторними дозами у симуляції багаторазового введення."
          onChange={(value) => update('tau', value)}
        />
      </div>
    </aside>
  )
}
