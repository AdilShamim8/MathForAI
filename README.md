# Math For AI

A focused, single-page-per-module curriculum site that teaches the math behind modern AI and machine learning. The project is a zero-build, static HTML/CSS/JS site with interactive visuals, guided learning paths, and a consistent design system.

## At a glance

- 9 guided modules that move from linear algebra to matrix factorization.
- Each module is a standalone HTML page with dynamic navigation, exercises, and interactive canvases.
- Shared styling in [site.css](site.css) and shared behavior in [clean-language.js](clean-language.js).
- No build step, no dependencies, no framework lock-in.

## Module map

Start from the home page, then study in sequence:

1. [linear_algebra_ml.html](linear_algebra_ml.html) - vectors, matrices, eigen, norms
2. [calculus_ml.html](calculus_ml.html) - derivatives, gradients, chain rule
3. [OptimizationConcepts.html](OptimizationConcepts.html) - gradient descent, learning rate, loss
4. [ProbabilityTheory.html](ProbabilityTheory.html) - probability foundations
5. [statistics_ml.html](statistics_ml.html) - statistics for ML decisions
6. [information_theory_ml.html](information_theory_ml.html) - entropy, CE, KL
7. [geometry_distances_ml.html](geometry_distances_ml.html) - distances, cosine, high-dim
8. [prob_linalg_ml.html](prob_linalg_ml.html) - multivariate Gaussian, covariance
9. [matrix_factorization_ml.html](matrix_factorization_ml.html) - SVD, PCA, low-rank

The entry point is [index.html](index.html).

## Project structure

- [index.html](index.html) - Home page, module list, start button
- Module pages (above) - Self-contained content, navigation, and interactivity
- [site.css](site.css) - Global theme, layout, and component styles
- [clean-language.js](clean-language.js) - Theme toggle, sitebar injection, accessibility helpers

## Run locally (step-by-step)

1. Download or clone the project.
2. Start a local server (recommended for consistent behavior):

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node
npx serve .
```

3. Open the site:

- http://localhost:8000/index.html

You can also open [index.html](index.html) directly from disk, but a local server is more reliable for relative links and localStorage.

## How the site works

Each module page defines a data structure in JavaScript (for example `TOPICS` or `topics`) and then renders navigation and content at runtime. This keeps the HTML light and makes it easy to add or reorder chapters without touching the DOM manually.

Shared behavior in [clean-language.js](clean-language.js) includes:

- Theme toggling (light/dark) via localStorage
- Sitebar injection on pages that do not hardcode it
- Accessibility fixes for disclosure widgets
- Cleanup of Bangla text nodes to keep English-only output

If you want bilingual output, remove the script tag that loads [clean-language.js](clean-language.js) from the module pages or edit the script to skip the cleaning step.

## Editing content (step-by-step)

1. Open the target module page (for example [linear_algebra_ml.html](linear_algebra_ml.html)).
2. Find the `TOPICS` (or `topics`) array near the bottom of the file.
3. Each entry contains:

	- `title` and optional `bn` or `bn_title`
	- `tags`
	- `content` or `body` as an HTML template string

4. Edit the HTML in the `content` string to update explanations, tables, or exercises.
5. Save and refresh the browser.

## Add a new module (step-by-step)

1. Duplicate a module page that is closest in structure.
2. Update the `<title>` tag and the module header in the JS template.
3. Update the `NAV` labels and `TOPICS` array inside the new file.
4. Add a new card in the modules grid on [index.html](index.html).
5. Update the hero path map (optional) on [index.html](index.html) to include the new step.
6. Verify navigation and progress counters in the new module.

## Theming and layout

- Global colors, spacing, and typography live in [site.css](site.css) under `:root` variables.
- Theme switching is driven by `data-theme` on `html` and the theme toggle button.
- Layout components (sitebar, sidebar, cards, callouts) are reusable classes defined once in [site.css](site.css).

## Deployment (step-by-step)

This is a static site. Any static host works:

1. Ensure all files are in the root of the site.
2. Upload to GitHub Pages, Netlify, Vercel, or any static server.
3. Set the root to the folder containing [index.html](index.html).

## Notes and limitations

- JavaScript is required for navigation, progress tracking, and interactive visualizations.
- Interactive sections use `<canvas>` and need a modern browser.
- There are no build tools or package dependencies.
 
