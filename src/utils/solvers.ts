export type ConcentrationPoint = {
  time: number
  concentration: number
}

export type PkParams = {
  D: number
  ka: number
  ke: number
  Vd: number
}

export type CompartmentState = {
  A: number
  C: number
}

const KA_KE_TOLERANCE = 1e-6

export function oneCompartmentConcentration(
  params: PkParams,
  time: number,
): number {
  const { D, ke, Vd } = params
  return (D / Vd) * Math.exp(-ke * time)
}

export function batemanConcentration(params: PkParams, time: number): number {
  const { D, ka, ke, Vd } = params

  if (Math.abs(ka - ke) < KA_KE_TOLERANCE) {
    return (D * ka * time * Math.exp(-ka * time)) / Vd
  }

  const factor = (D * ka) / (Vd * (ka - ke))
  return factor * (Math.exp(-ke * time) - Math.exp(-ka * time))
}

export function generateTimeSeries(
  duration: number,
  step: number,
): number[] {
  const times: number[] = []
  const steps = Math.round(duration / step)

  for (let index = 0; index <= steps; index += 1) {
    times.push(Number((index * step).toFixed(10)))
  }

  return times
}

export function oneCompartmentAnalytical(
  params: PkParams,
  duration: number,
  step: number,
): ConcentrationPoint[] {
  return generateTimeSeries(duration, step).map((time) => ({
    time,
    concentration: oneCompartmentConcentration(params, time),
  }))
}

export function batemanAnalytical(
  params: PkParams,
  duration: number,
  step: number,
): ConcentrationPoint[] {
  return generateTimeSeries(duration, step).map((time) => ({
    time,
    concentration: batemanConcentration(params, time),
  }))
}

export function twoCompartmentDerivatives(
  state: CompartmentState,
  params: PkParams,
): CompartmentState {
  const { A, C } = state
  const { ka, ke, Vd } = params

  return {
    A: -ka * A,
    C: (ka * A) / Vd - ke * C,
  }
}

export function eulerStep(
  state: CompartmentState,
  dt: number,
  params: PkParams,
): CompartmentState {
  const derivatives = twoCompartmentDerivatives(state, params)

  return {
    A: state.A + dt * derivatives.A,
    C: state.C + dt * derivatives.C,
  }
}

export function rk4Step(
  state: CompartmentState,
  dt: number,
  params: PkParams,
): CompartmentState {
  const k1 = twoCompartmentDerivatives(state, params)

  const k2State: CompartmentState = {
    A: state.A + (dt / 2) * k1.A,
    C: state.C + (dt / 2) * k1.C,
  }
  const k2 = twoCompartmentDerivatives(k2State, params)

  const k3State: CompartmentState = {
    A: state.A + (dt / 2) * k2.A,
    C: state.C + (dt / 2) * k2.C,
  }
  const k3 = twoCompartmentDerivatives(k3State, params)

  const k4State: CompartmentState = {
    A: state.A + dt * k3.A,
    C: state.C + dt * k3.C,
  }
  const k4 = twoCompartmentDerivatives(k4State, params)

  return {
    A: state.A + (dt / 6) * (k1.A + 2 * k2.A + 2 * k3.A + k4.A),
    C: state.C + (dt / 6) * (k1.C + 2 * k2.C + 2 * k3.C + k4.C),
  }
}

type NumericalIntegrator = (
  state: CompartmentState,
  dt: number,
  params: PkParams,
) => CompartmentState

function simulateTwoCompartmentNumerical(
  params: PkParams,
  duration: number,
  dt: number,
  integrator: NumericalIntegrator,
): ConcentrationPoint[] {
  let state: CompartmentState = { A: params.D, C: 0 }
  const points: ConcentrationPoint[] = [{ time: 0, concentration: state.C }]

  for (let time = dt; time <= duration + 1e-9; time += dt) {
    state = integrator(state, dt, params)
    points.push({
      time: Number(time.toFixed(10)),
      concentration: Math.max(state.C, 0),
    })
  }

  return points
}

export function eulerTwoCompartment(
  params: PkParams,
  duration: number,
  dt: number,
): ConcentrationPoint[] {
  return simulateTwoCompartmentNumerical(params, duration, dt, eulerStep)
}

export function rk4TwoCompartment(
  params: PkParams,
  duration: number,
  dt: number,
): ConcentrationPoint[] {
  return simulateTwoCompartmentNumerical(params, duration, dt, rk4Step)
}

export function multiDoseRk4(
  params: PkParams,
  tau: number,
  duration: number,
  dt: number,
): ConcentrationPoint[] {
  let state: CompartmentState = { A: params.D, C: 0 }
  let lastDoseIndex = 0
  const points: ConcentrationPoint[] = [{ time: 0, concentration: state.C }]

  for (let time = dt; time <= duration + 1e-9; time += dt) {
    const doseIndex = Math.floor(time / tau + 1e-9)

    if (doseIndex > lastDoseIndex) {
      state = {
        ...state,
        A: state.A + params.D * (doseIndex - lastDoseIndex),
      }
      lastDoseIndex = doseIndex
    }

    state = rk4Step(state, dt, params)
    points.push({
      time: Number(time.toFixed(10)),
      concentration: Math.max(state.C, 0),
    })
  }

  return points
}

export function findPeak(points: ConcentrationPoint[]): {
  cmax: number
  tmax: number
} {
  return points.reduce(
    (peak, point) =>
      point.concentration > peak.cmax
        ? { cmax: point.concentration, tmax: point.time }
        : peak,
    { cmax: 0, tmax: 0 },
  )
}

export function maximumAbsolutePercentageError(
  numerical: ConcentrationPoint[],
  reference: (time: number) => number,
): number {
  let maxError = 0

  for (const point of numerical) {
    const exact = reference(point.time)

    if (exact > 1e-9) {
      const error = (Math.abs(point.concentration - exact) / exact) * 100
      maxError = Math.max(maxError, error)
    }
  }

  return maxError
}
