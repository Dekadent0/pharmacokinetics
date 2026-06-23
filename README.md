# PK Simulator

Interactive pharmacokinetics (PK) model simulator for studying oral drug absorption, analytical solutions, and numerical integration methods.

Built as a university project for mathematical and computer modeling.

## Features

- **Single-dose analysis** — compare Bateman (two-compartment), one-compartment, Euler, and RK4 curves
- **Multi-dose simulation** — drug accumulation with a therapeutic safety window (RK4)
- **Error metrics** — MAPE for Euler and RK4 vs. the analytical Bateman solution
- **Interactive parameters** — dose, absorption/elimination rates, volume, step size, dosing interval
- **Equation reference** — LaTeX formulas rendered with KaTeX

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts
- KaTeX
- Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Other scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run ESLint               |

## Project Structure

```
src/
├── components/       # UI (Header, Sidebar, charts, tabs)
├── hooks/
│   └── useSimulation.ts   # Orchestrates simulation from parameters
├── utils/
│   └── solvers.ts         # Pure PK math (Bateman, Euler, RK4)
├── App.tsx           # Root layout and parameter state
├── main.tsx          # Entry point
└── index.css         # Tailwind imports
```

## Architecture

```
User → App (parameters) → useSimulation → solvers.ts → charts & metrics
```

- **App** holds simulation parameters
- **useSimulation** derives results when parameters change
- **solvers.ts** contains all mathematical logic (no React)
- **Components** display data and handle user input

## License

Private / educational use.
