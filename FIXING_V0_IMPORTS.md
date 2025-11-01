# Fixing v0.dev Imports for Astro

## Changes Needed in `apps/public/src/components/react/Homepage.tsx`

### 1. Replace Next.js Link with Regular Links

**Find:**
```tsx
import Link from 'next/link'
```

**Replace with:**
```tsx
// Remove this import completely
```

**Then find all:**
```tsx
<Link href="/path">Text</Link>
```

**Replace with:**
```tsx
<a href="/path">Text</a>
```

### 2. Fix Navigation Import

**Find:**
```tsx
import { Navigation } from '@/components/navigation'
```

**Options:**
- **Option A**: Remove the import and inline the navigation in Homepage.tsx
- **Option B**: If v0.dev provided `navigation.tsx`, copy it to `apps/public/src/components/react/Navigation.tsx` and update import:

```tsx
import { Navigation } from '../react/Navigation'
```

### 3. Shadcn Component Imports

These should already work, but if you see errors, they should look like:

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

These are already correct and should work!

### Quick Fix Example:

**Before (Next.js):**
```tsx
import Link from 'next/link'
import { Navigation } from '@/components/navigation'

export default function Homepage() {
  return (
    <div>
      <Navigation />
      <Link href="/cakes">
        <Button>Наши Торты</Button>
      </Link>
    </div>
  )
}
```

**After (Astro-compatible):**
```tsx
// No Link import needed

export default function Homepage() {
  return (
    <div>
      {/* Navigation is now inline or imported from ../react/Navigation */}
      <nav>...</nav>
      
      <a href="/cakes">
        <Button>Наши Торты</Button>
      </a>
    </div>
  )
}
```

## TL;DR

1. Remove `import Link from 'next/link'`
2. Replace all `<Link href="...">` with `<a href="...">`
3. Fix or inline the Navigation component
4. Shadcn imports should work as-is

After these changes, run:
```bash
npx nx run public:dev
```
