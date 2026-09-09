# Apex Sync Brand Studio

Apex Sync Brand Studio is a design operating system for structured executive publishing. It turns recurring brand, campaign, and presentation work into a repeatable software workflow instead of an ad-hoc design process.

## What the product does

Brand Studio helps founders, executives, and communications teams create consistent thought-leadership assets, executive cards, carousels, and presentation-ready documents from one controlled workspace.

The product currently includes:

- A single-card design studio with live editing
- A structured 8-layout carousel system
- Brand-kit configuration for typography, logo, colors, website, social handle, and watermarking
- Campaign metadata for series, episodes, and day sequences
- Multi-format export workflows for PNG, JPEG, SVG, and PDF
- Export history stored locally in the browser
- Optional server-side content generation through Gemini, with local fallback content
- Browser persistence for brand settings, projects, drafts, decks, and export records
- Multi-brand profile switching for separate company/client brand kits
- Brand-scoped project workspaces with create, open, edit, duplicate, archive, restore, and delete flows
- Project-scoped single-card drafts and carousel decks
- Project-aware export history with brand and project attribution
- Autosaved working sessions with last-edited project tracking

## Why it exists

Most content teams repeatedly rebuild the same visual decisions: spacing, hierarchy, footer structure, campaign labels, dimensions, logo placement, and export rules.

Brand Studio treats those decisions as a system.

The goal is to reduce repetitive production work while preserving brand consistency across campaigns and formats.

## Product architecture

### Frontend

- React 19
- TypeScript
- Tailwind CSS
- Motion
- Vite
- html-to-image
- jsPDF

### Backend

- Express
- TypeScript
- Gemini API integration
- Structured JSON generation endpoint
- Local generation fallback when no API key is configured

## Workspace hierarchy

Brand Studio V2 organizes production using a simple ownership model:

```text
Brand
└── Project
    ├── Campaign / Series context
    ├── Single-card draft
    ├── Carousel deck
    └── Exported assets
```

Each brand can contain multiple projects. Opening a project restores that project's working state, and duplicating a project copies its draft/deck workspace without mixing export history.

### Projects

The Projects workspace supports:

- Creating and naming production workspaces
- Campaign / series metadata
- Project briefs
- Opening and resuming prior work
- Last-edited activity tracking
- Duplicating project draft/deck state
- Archiving and restoring projects
- Deleting project working state with confirmation
- Project-level export counts

## Core production workspaces

### Brand Studio

The precision editor for individual visual assets.

It supports:

- Template selection
- Headline, subtitle, and quotation editing
- Typography sizing and alignment
- Element positioning
- Background presets
- Brand metadata
- QR and website overlays
- High-resolution exports

### Carousel Builder

A deck-production workspace built around eight repeatable slide archetypes:

1. Hero Statement
2. Explanation
3. Quote
4. Comparison
5. Framework
6. Metric
7. Blueprint
8. Closing Slide

The layout system is designed to make long-form campaigns visually coherent without forcing every slide to look identical.

## Data and persistence

The current version is local-first.

Brand profiles, project records, active-project selection, editor drafts, carousel decks, workspace settings, and export history are stored in browser localStorage. Project draft/deck keys are isolated by project ID so switching projects does not overwrite another workspace. No cloud account or multi-user synchronization is required for the current implementation.

Cloud workspaces, collaboration, permissions, and remote project storage are planned product extensions rather than current capabilities.

## Local development

1. Clone the repository.
2. Install dependencies with Bun or your preferred compatible package manager.
3. Copy `.env.example` to `.env`.
4. Add a Gemini API key only if you want server-side content generation.
5. Run:

```bash
bun install
bun run dev
```

The application runs on port 3000 by default.

## Environment

```bash
GEMINI_API_KEY=
```

If no valid Gemini API key is configured, the generation endpoint falls back to local preset content.

## Product principles

Brand Studio is being developed around five principles:

1. **System before decoration** — repeatable rules are more valuable than one-off visuals.
2. **Truthful product state** — the interface should never display fake metrics or imply services that are not active.
3. **Local-first reliability** — core editing and export workflows should not depend on external services.
4. **Brand consistency by default** — typography, colors, metadata, and layout rules should remain synchronized.
5. **Human control** — generation can assist drafting, but the editor remains the source of truth.

## V2 direction

The next product iteration focuses on:

- Project version history and restore points
- Better empty-state onboarding and first-run guidance
- Import/export of complete workspace data
- Cloud synchronization and team collaboration
- Role-based permissions
- Publishing calendar integrations
- Motion exports
- Accessibility and keyboard workflows
- Automated tests and broader CI coverage

## Build verification

A GitHub Actions workflow is included to run the TypeScript check and production build on V2 pushes and pull requests. If repository Actions are disabled, those checks will not execute until Actions are enabled.

## Repository status

Brand Studio is an active independent product project and is still evolving. Features listed as roadmap items are not represented as completed capabilities until they are implemented in the codebase.
