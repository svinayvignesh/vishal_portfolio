# Vishal Shasi - Interactive 3D Portfolio

An interactive portfolio website featuring immersive 3D backgrounds that respond to scroll position and device orientation. Built with React Three Fiber for WebGL rendering, the site showcases 8+ years of process engineering experience across aerospace, automotive, and manufacturing industries.

## Features

- **Interactive 3D Scenes**: Six unique 3D environments (CNC machine, 3D printer, gas turbine, automotive, and more) that transition as you navigate through career experiences
- **Gyroscope Support**: On mobile devices, 3D scenes respond to device tilt for an immersive experience
- **Scroll-Based Navigation**: Smooth section transitions with progress indicators
- **Performance Optimized**: Tiered rendering for different device capabilities with instanced meshes and optimized geometry
- **Responsive Design**: Adapts seamlessly across desktop, tablet, and mobile devices

## Sections

- **Hero**: Introduction with animated tagline
- **About**: Professional summary and career highlights
- **Experience**: Interactive career timeline with role-specific 3D backgrounds
- **Education**: Academic credentials with institution logos
- **Expertise**: Skills organized by category (Process & Manufacturing, Lean/CI, Design & Analytics)
- **Projects**: Featured work with metrics and technologies
- **Contact**: Professional contact information and resume download

## Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics**: [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://greensock.com/gsap/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vishal_portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Project Structure

```
src/
├── components/
│   ├── 3d/              # Three.js scenes and 3D components
│   │   └── scenes/      # Individual 3D scene definitions
│   ├── overlay/         # UI overlay components
│   │   └── sections/    # Page sections (Hero, About, etc.)
│   └── ui/              # Reusable UI components (shadcn)
├── data/                # Portfolio content data
├── hooks/               # Custom React hooks
├── store/               # Zustand state management
└── utils/               # Utility functions
public/
├── models/              # 3D model files (GLB/GLTF)
├── logos/               # Company and institution logos
└── certificates/        # Certificate images
```

## License

All rights reserved.

## Credits

This portfolio, developed in 2026, uses the following 3D models licensed under Creative Commons:

- **[CNC Machine](https://sketchfab.com/3d-models/cnc-machine-af387e70d78a4ba4886af58dd7aec96b)** by [Khushbushah](https://sketchfab.com/Khushbushah) ([CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/))
- **[Ford F150 Raptor](https://sketchfab.com/3d-models/ford-f150-raptor-5bde9684bf6d40e0902ee8e482ad1063)** by [Outlaw Games™](https://sketchfab.com/Outlaw_Games) ([CC-BY-NC-4.0](http://creativecommons.org/licenses/by-nc/4.0/))
- **[Schaefer Gas Aluminum Furnace](https://sketchfab.com/3d-models/schaefer-gas-aluminum-furnace-1ff6be358af648e9aa94de221bad73aa)** by [The Schaefer Group](https://sketchfab.com/schaefergroup) ([CC-BY-NC-ND-4.0](http://creativecommons.org/licenses/by-nc-nd/4.0/))
- **[Document File Folder](https://sketchfab.com/3d-models/document-file-folder-11390179bba7462484d344e2fe22c703)** by [Kami Rapacz](https://sketchfab.com/kuroderuta) ([CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/))
- **[Resin 3D Printer](https://sketchfab.com/3d-models/resin-3d-printer-b77b9c1c4c1b4a35a867beebeac5de60)** by [YouniqueĪdeaStudio](https://sketchfab.com/sinnervoncrawsz) ([CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/))
- **[Turbine-01](https://sketchfab.com/3d-models/turbine-01-e03a3c7ce147460e948f56573d1fdf87)** by [Karan.Dhindsa](https://sketchfab.com/Karan.Dhindsa) ([CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/))
