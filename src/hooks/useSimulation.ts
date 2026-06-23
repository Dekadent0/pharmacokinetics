import { useMemo } from 'react'
import {
  batemanAnalytical,
  batemanConcentration,
  eulerTwoCompartment,
  findPeak,
  maximumAbsolutePercentageError,
  multiDoseRk4,
  oneCompartmentAnalytical,
  rk4TwoCompartment,
  type ConcentrationPoint,
  type PkParams,
} from '../utils/solvers'

export type SimulationParams = PkParams & {
  dt: number
  tau: number
}

export type ChartPoint = {
  x: number
  y: number
}

export type SimulationResult = {
  batemanSeries: ChartPoint[]
  oneCompSeries: ChartPoint[]
  eulerSeries: ChartPoint[]
  rk4Series: ChartPoint[]
  multiDoseSeries: ChartPoint[]
  cmax: number
  tmax: number
  maxEulerError: number
  maxRk4Error: number
  inTherapeuticWindow: number
  eliminationHalfLife: number
}

const SINGLE_DOSE_DURATION = 24
const MULTI_DOSE_DURATION = 48
const ANALYTICAL_STEP = 0.1
const THERAPEUTIC_MIN = 5
const THERAPEUTIC_MAX = 25

const toChartSeries = (points: ConcentrationPoint[]): ChartPoint[] =>
  points.map((point) => ({ x: point.time, y: point.concentration }))

const calculateTherapeuticCoverage = (
  points: ConcentrationPoint[],
  min: number,
  max: number,
): number => {
  if (points.length === 0) return 0

  const inWindow = points.filter(
    (point) => point.concentration >= min && point.concentration <= max,
  ).length

  return (inWindow / points.length) * 100
}

export function useSimulation(params: SimulationParams): SimulationResult {
  return useMemo(() => {
    const pkParams: PkParams = {
      D: params.D,
      ka: params.ka,
      ke: params.ke,
      Vd: params.Vd,
    }

    const bateman = batemanAnalytical(pkParams, SINGLE_DOSE_DURATION, ANALYTICAL_STEP)
    const oneComp = oneCompartmentAnalytical(pkParams, SINGLE_DOSE_DURATION, ANALYTICAL_STEP)
    const euler = eulerTwoCompartment(pkParams, SINGLE_DOSE_DURATION, params.dt)
    const rk4 = rk4TwoCompartment(pkParams, SINGLE_DOSE_DURATION, params.dt)
    const multiDose = multiDoseRk4(pkParams, params.tau, MULTI_DOSE_DURATION, params.dt)

    const peak = findPeak(bateman)
    const reference = (time: number) => batemanConcentration(pkParams, time)

    return {
      batemanSeries: toChartSeries(bateman),
      oneCompSeries: toChartSeries(oneComp),
      eulerSeries: toChartSeries(euler),
      rk4Series: toChartSeries(rk4),
      multiDoseSeries: toChartSeries(multiDose),
      cmax: peak.cmax,
      tmax: peak.tmax,
      maxEulerError: maximumAbsolutePercentageError(euler, reference),
      maxRk4Error: maximumAbsolutePercentageError(rk4, reference),
      inTherapeuticWindow: calculateTherapeuticCoverage(
        multiDose,
        THERAPEUTIC_MIN,
        THERAPEUTIC_MAX,
      ),
      eliminationHalfLife: Math.log(2) / params.ke,
    }
  }, [params.D, params.ka, params.ke, params.Vd, params.dt, params.tau])
}

export const THERAPEUTIC_WINDOW = {
  min: THERAPEUTIC_MIN,
  max: THERAPEUTIC_MAX,
} as const
