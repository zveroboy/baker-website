# @baker/public - Next.js Frontend

A modern Next.js 16 application for the baker's personal website built with React 19, Tailwind CSS, and shadcn/ui components.

## 🏗️ Project Structure

```text
/
├── public/              # Static assets (favicon, images)
├── src/
│   ├── app/
│   │   ├── layout.tsx   # Root layout with metadata
│   │   ├── page.tsx     # Homepage
│   │   ├── globals.css  # Global styles with Tailwind
│   │   ├── cakes/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── gallery/
│   │   ├── menu/
│   │   ├── about/
│   │   └── order/
│   ├── components/
│   │   ├── navigation.tsx
│   │   ├── react/
│   │   │   └── Homepage.tsx
│   │   └── ui/          # shadcn/ui components
│   └── lib/
│       └── utils.ts
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── package.json
```

## 🚀 Commands

All commands are run from the root of the workspace using `turbo`:

| Command                  | Action                                    |
|:-------------------------|:------------------------------------------|
| `npm run dev`            | Start local dev server at `localhost:3000` |
| `npm run build`          | Build for production to `./.next/`        |
| `npm run start`          | Start production server                   |
| `npm run lint`           | Run Biome linter on source                |

## 🔧 Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with CSS variables
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Linting**: [Biome](https://biomejs.dev/)

## 📝 Notes

- Uses App Router for modern Next.js development
- Metadata configured in `layout.tsx` for SEO
- Path alias `@/*` configured for cleaner imports
- Global styles in `src/app/globals.css` with Tailwind directives
- Server Components by default with selective client components (marked with `"use client"`)
