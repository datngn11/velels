<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->
# Project Guidelines & Rules

This project is a luxury e-commerce site utilizing modern frontend architecture. All AI agents must strictly follow these rules:

1. **Tailwind CSS v4**: 
   - This project uses Tailwind CSS v4 which is CSS-first. 
   - We use the `@theme` directive in `src/app/globals.css`. 
   - **CRITICAL**: Do NOT attempt to create, modify, or use `tailwind.config.js` or `tailwind.config.ts`.

2. **Component Strategy (Radix UI)**:
   - We use **Radix UI primitives** (`@radix-ui/react-*`) directly for accessible interactive components.
   - **CRITICAL**: Do NOT run the standard Shadcn CLI (`npx shadcn-ui@latest init` or `add`). Do NOT create a `components.json`. The CLI conflicts with our Tailwind v4 setup. If a new primitive is needed, install the Radix package directly and style it using Tailwind v4 utility classes.

3. **Design Aesthetic**:
   - The design must be luxury, minimalist, and editorial fashion.
   - Avoid standard UI library looks; keep bundle sizes minimal and styles premium.

4. **Animations & Accessibility**:
   - Use GPU-accelerated keyframe animations (e.g., `overlayShow`, `contentShow` defined in `globals.css`).
   - All transitions and animations MUST respect `prefers-reduced-motion: reduce`.
<!-- END:project-rules -->
