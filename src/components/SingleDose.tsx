import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertTriangle, Clock, Target, TrendingUp } from 'lucide-react'
import type { SimulationResult } from '../hooks/useSimulation'

type SingleDoseProps = {
  result: SimulationResult
}

type SeriesKey = 'bateman' | 'rk4' | 'euler' | 'oneComp'

type SeriesVisibility = Record<SeriesKey, boolean>

const chartColors = {
  bateman: '#10b981',
  oneComp: '#94a3b8',
  euler: '#f59e0b',
  rk4: '#ef4444',
} as const

const eulerDot = { r: 3, fill: chartColors.euler, stroke: chartColors.euler, strokeWidth: 1 }

const rk4Dot = {
  r: 3,
  fill: '#ffffff',
  stroke: chartColors.rk4,
  strokeWidth: 1.5,
}

const seriesConfig: {
  key: SeriesKey
  label: string
  color: string
  dashed?: boolean
}[] = [
  { key: 'bateman', label: 'Бейтман (точний)', color: chartColors.bateman },
  { key: 'rk4', label: 'Рунге—Кутта 4', color: chartColors.rk4, dashed: true },
  { key: 'euler', label: 'Ейлер', color: chartColors.euler },
  { key: 'oneComp', label: 'Однокомпартментна', color: chartColors.oneComp, dashed: true },
]

const defaultVisibility: SeriesVisibility = {
  bateman: true,
  rk4: true,
  euler: true,
  oneComp: true,
}

export function SingleDose({ result }: SingleDoseProps) {
  const [visible, setVisible] = useState<SeriesVisibility>(defaultVisibility)

  const toggleSeries = (key: SeriesKey) => {
    setVisible((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Порівняння одноразової дози</h2>
        <p className="mt-1 text-sm text-slate-500">
          Аналітичне рівняння Бейтмана (двокомпартментна модель) проти миттєвого всмоктування,
          методу Ейлера та Рунге—Кутти 4-го порядку за 24 год.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
          label="Пікова концентрація"
          symbol="Cₘₐₓ"
          value={`${result.cmax.toFixed(2)} мг/л`}
        />
        <MetricCard
          icon={<Clock className="h-4 w-4 text-cyan-600" />}
          label="Час піку"
          symbol="Tₘₐₓ"
          value={`${result.tmax.toFixed(2)} год`}
        />
        <MetricCard
          icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
          label="Макс. похибка Ейлера"
          symbol="MAPE"
          value={`${result.maxEulerError.toFixed(3)}%`}
        />
        <MetricCard
          icon={<Target className="h-4 w-4 text-rose-600" />}
          label="Макс. похибка RK4"
          symbol="MAPE"
          value={`${result.maxRk4Error.toFixed(4)}%`}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Концентрація в плазмі від часу
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Ліва вісь: двокомпартментна модель та чисельні методи · Права вісь:
              однокомпартментна модель
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {seriesConfig.map((series) => (
              <SeriesToggle
                key={series.key}
                label={series.label}
                color={series.color}
                dashed={series.dashed}
                checked={visible[series.key]}
                onChange={() => toggleSeries(series.key)}
              />
            ))}
          </div>
        </div>

        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, 24]}
                tickFormatter={(value: number) => `${value}`}
                label={{ value: 'Час (год)', position: 'insideBottom', offset: -2 }}
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'C (мг/л)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value: number) => value.toFixed(1)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={chartColors.oneComp}
                hide={!visible.oneComp}
                label={{ value: 'Однокомп. (мг/л)', angle: 90, position: 'insideRight' }}
                tickFormatter={(value: number) => value.toFixed(1)}
              />
              <Tooltip
                formatter={(value) =>
                  value == null || typeof value !== 'number' ? '—' : `${value.toFixed(3)} мг/л`
                }
                labelFormatter={(_, payload) => {
                  const x = payload?.[0]?.payload?.x
                  return x == null ? '' : `t = ${Number(x).toFixed(2)} год`
                }}
              />
              <Line
                yAxisId="left"
                data={result.batemanSeries}
                type="linear"
                dataKey="y"
                name="Бейтман (точний)"
                stroke={chartColors.bateman}
                strokeWidth={4}
                dot={false}
                hide={!visible.bateman}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                data={result.oneCompSeries}
                type="linear"
                dataKey="y"
                name="Однокомпартментна"
                stroke={chartColors.oneComp}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                hide={!visible.oneComp}
                isAnimationActive={false}
              />
              <Line
                yAxisId="left"
                data={result.eulerSeries}
                type="linear"
                dataKey="y"
                name="Ейлер"
                stroke={chartColors.euler}
                strokeWidth={2}
                dot={eulerDot}
                hide={!visible.euler}
                isAnimationActive={false}
              />
              <Line
                yAxisId="left"
                data={result.rk4Series}
                type="linear"
                dataKey="y"
                name="Рунге—Кутта 4"
                stroke={chartColors.rk4}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={rk4Dot}
                hide={!visible.rk4}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

type SeriesToggleProps = {
  label: string
  color: string
  dashed?: boolean
  checked: boolean
  onChange: () => void
}

function SeriesToggle({ label, color, dashed, checked, onChange }: SeriesToggleProps) {
  return (
    <label className="chart-series-toggle group flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs transition-colors hover:border-slate-300 hover:bg-white">
      <span
        className="inline-block w-5 shrink-0 border-t-2"
        style={{ borderColor: color, borderTopStyle: dashed ? 'dashed' : 'solid' }}
        aria-hidden
      />
      <span className={`font-medium ${checked ? 'text-slate-800' : 'text-slate-400'}`}>
        {label}
      </span>
      <input
        type="checkbox"
        className="chart-series-toggle__input sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span
        className={`chart-series-toggle__track relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-emerald-500' : 'bg-slate-300'
        }`}
        aria-hidden
      >
        <span
          className={`chart-series-toggle__thumb absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
    </label>
  )
}

function MetricCard({
  icon,
  label,
  symbol,
  value,
}: {
  icon: ReactNode
  label: string
  symbol: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {icon}
      </div>
      <p className="mt-2 font-mono text-xs text-emerald-700">{symbol}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  )
}
