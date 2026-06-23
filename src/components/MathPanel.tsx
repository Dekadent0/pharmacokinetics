import katex from 'katex'
import { BookOpen } from 'lucide-react'

type FormulaBlockProps = {
  title: string
  latex: string
  description: string
}

const formulas: FormulaBlockProps[] = [
  {
    title: 'Однокомпартментна модель (миттєве всмоктування)',
    latex: String.raw`C(t) = \frac{D}{V_d} \cdot e^{-k_e t}`,
    description:
      'Припускає миттєвий перехід усієї дози в центральний компартмент.',
  },
  {
    title: 'Рівняння Бейтмана (двокомпартментна модель)',
    latex: String.raw`C(t) = \frac{D \cdot k_a}{V_d (k_a - k_e)} \left(e^{-k_e t} - e^{-k_a t}\right)`,
    description: 'Точний розв\'язок для всмоктування та елімінації першого порядку.',
  },
  {
    title: 'Граничний випадок (kₐ = kₑ), правило Лопіталя',
    latex: String.raw`C(t) = \frac{D \cdot k_a \cdot t \cdot e^{-k_a t}}{V_d}`,
    description: 'Вироджений випадок, коли швидкості всмоктування та елімінації рівні.',
  },
  {
    title: 'Вектор стану системи ОДР',
    latex: String.raw`\mathbf{y} = [A,\; C]^T`,
    description: 'A — маса препарату в ШКТ (мг); C — концентрація в плазмі (мг/л).',
  },
  {
    title: 'Диференціальні рівняння моделі',
    latex: String.raw`\frac{dA}{dt} = -k_a A \qquad \frac{dC}{dt} = \frac{k_a A}{V_d} - k_e C`,
    description: 'Двокомпартментна модель для чисельних інтеграторів Ейлера та RK4.',
  },
  {
    title: 'Метод Ейлера',
    latex: String.raw`\mathbf{y}_{n+1} = \mathbf{y}_n + \Delta t \cdot f(\mathbf{y}_n)`,
    description: 'Явна інтеграція першого порядку — швидка, але накопичує похибку.',
  },
  {
    title: 'Метод Рунге—Кутти 4-го порядку',
    latex: String.raw`\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{\Delta t}{6}(k_1 + 2k_2 + 2k_3 + k_4)`,
    description: 'Метод четвертого порядку з вищою точністю для гладких систем ОДР.',
  },
  {
    title: 'Коефіцієнти стадій RK4',
    latex: String.raw`k_1 = f(\mathbf{y}_n),\; k_2 = f\!\left(\mathbf{y}_n + \tfrac{\Delta t}{2}k_1\right),\; k_3 = f\!\left(\mathbf{y}_n + \tfrac{\Delta t}{2}k_2\right),\; k_4 = f(\mathbf{y}_n + \Delta t\, k_3)`,
    description: 'Стандартні обчислення стадій методу Рунге—Кутти 4-го порядку.',
  },
]

function LatexBlock({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: true,
  })

  return (
    <div
      className="overflow-x-auto py-2 text-slate-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function FormulaCard({ title, latex, description }: FormulaBlockProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <div className="mt-3 rounded-xl bg-slate-50 px-4 ring-1 ring-slate-100">
        <LatexBlock latex={latex} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
    </article>
  )
}

export function MathPanel() {
  return (
    <section className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Математичний довідник</h2>
          <p className="mt-1 text-sm text-slate-500">
            Рівняння для аналітичних розв&apos;язків та чисельних методів інтегрування.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {formulas.map((formula) => (
          <FormulaCard key={formula.title} {...formula} />
        ))}
      </div>
    </section>
  )
}
