import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Layers, ShieldCheck } from 'lucide-react'
import { THERAPEUTIC_WINDOW, type SimulationResult } from '../hooks/useSimulation'

type MultiDoseProps = {
  tau: number
  result: SimulationResult
}

const numericalDot = { r: 3, strokeWidth: 1, fill: 'currentColor' }

export function MultiDose({ tau, result }: MultiDoseProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Накопичення при багаторазовому введенні
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Повторне пероральне дозування кожні τ = {tau} год, симульоване методом Рунге—Кутти 4-го
          порядку за 48 год.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-medium text-emerald-900">Терапевтична зона безпеки</p>
            <p className="mt-1 text-sm text-emerald-800">
              Ефективний діапазон: {THERAPEUTIC_WINDOW.min} – {THERAPEUTIC_WINDOW.max} мг/л
            </p>
            <p className="mt-2 text-lg font-semibold text-emerald-900">
              {result.inTherapeuticWindow.toFixed(1)}% часу в межах вікна
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Layers className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
          <div>
            <p className="text-sm font-medium text-slate-800">Профіль накопичення</p>
            <p className="mt-1 text-sm text-slate-500">
              Препарат накопичується, коли інтервал дозування τ коротший за період напіввиведення
              (t½ ≈ {result.eliminationHalfLife.toFixed(2)} год).
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          Накопичення концентрації з терапевтичним вікном
        </h3>
        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, 48]}
                label={{ value: 'Час (год)', position: 'insideBottom', offset: -2 }}
              />
              <YAxis
                label={{ value: 'C (мг/л)', angle: -90, position: 'insideLeft' }}
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
              <Legend />
              <ReferenceArea
                y1={THERAPEUTIC_WINDOW.min}
                y2={THERAPEUTIC_WINDOW.max}
                fill="#86efac"
                fillOpacity={0.35}
                label={{
                  value: 'Терапевтичне вікно',
                  position: 'insideTopRight',
                  fill: '#166534',
                  fontSize: 12,
                }}
              />
              <Line
                data={result.multiDoseSeries}
                type="linear"
                dataKey="y"
                name="Рунге—Кутта 4 (багаторазове)"
                stroke="#2563eb"
                strokeWidth={2}
                dot={numericalDot}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
