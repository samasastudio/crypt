# UX, Performance, And Content Pipeline

Use this document when specifying screen structure, interaction rules, runtime constraints, and the format used to author scenes and AV families.

## Core screens

1. Landing or invocation screen.
2. Main narrative chamber.
3. Transition states or chapter markers.
4. Ending or revelation screen.
5. Export or relic screen.
6. basilisk-av handoff screen.

## Main narrative screen

Should include:

- primary text panel
- choice list, ritual response input, or a hybrid response control depending on segment mode
- subtle ritual metadata
- ambient Hydra canvas
- minimal status hints if any
- optional hidden debug toggle in development mode

## UX principles

- minimal chrome
- no clutter
- restrained animation
- readable typography
- strong pacing
- avoid over-explaining systems
- let the system feel responsive and listening without exposing raw orchestration machinery
- keep occult stats hidden in normal play

## Ending screen framing

Suggested labels:

- The Chronicle
- The Sound Script
- The Vision Script
- The Seed of Return

These labels should make the export flow feel ceremonial and memorable.

## Performance goals

Desktop web is the primary target.

Desired baseline:

- smooth text transitions
- stable Hydra rendering
- clean audio playback
- no audible pops on scene transitions
- modest memory footprint
- fast enough initial load to feel intentional

## Runtime constraints

### Audio

- 3-6 simultaneous audio layers
- shared FX buses
- limited heavy effects
- lazy-load larger asset groups
- avoid frequent node churn
- smooth parameter ramps instead of abrupt reconfiguration
- orchestration updates should prefer sparse cue changes over constant churn

### Visuals

- one active Hydra family at a time
- bounded complexity
- limited full patch rewrites
- parameter mutation preferred over complete re-instantiation
- orchestration should avoid rapid family thrashing

### Mobile expectations

Modern mobile browsers may support simplified play, but v1 should optimize for desktop-first polish.

## Content pipeline

### Narrative content format

Scenes should live in structured data files, not hardcoded components.

Recommended formats:

- JSON
- TypeScript objects
- MDX-backed structured content

Each narrative segment should define:

- response mode
- ritual tags
- continuity hooks
- pacing band
- valid successor patterns
- linked audio and visual cues

### Audio content pipeline

Each audio family should define:

- asset references
- allowable tempo ranges
- motif tokens
- sample categories
- compatible ritual states
- export grammar hooks
- orchestration transition notes

### Visual content pipeline

Each visual family should define:

- base Hydra patch template
- state mappings
- palette options
- transition behaviors
- export formatter hooks

### Orchestration content pipeline

The orchestration layer should be driven by explicit data and rules rather than prompts alone. Useful authoring assets include:

- response-to-intent mapping tables
- segment eligibility rules
- pacing policies
- motif recurrence rules
- audio and visual family handoff policies

## Related docs

- [Architecture](architecture.md)
- [Audio system](../systems/audio-system.md)
- [Visual system](../systems/visual-system.md)
