# Architecture

Use this document when defining application boundaries, runtime responsibilities, and the overall technical structure of the Basilisk SH app.

## High-level architecture

### Front-end application layer

Responsibilities:

- routing and shell
- UI rendering
- narrative display
- choice controls
- overlays, debug, and transitions
- export presentation
- basilisk-av handoff UI

Suggested stack:

- React
- TypeScript
- Vite
- Zustand
- Tailwind or a similar styling layer

### Narrative engine

Responsibilities:

- scene progression
- response intake and normalization
- event triggering
- ending resolution
- run logging
- symbolic tag accumulation

### Ritual state engine

Responsibilities:

- maintain hidden occult variables
- derive narrative and AV-facing parameters
- smooth transitions
- expose selectors for orchestration, scoring, and renderer updates

### Orchestration engine

Responsibilities:

- interpret player response in context of ritual state, pacing, and run history
- select the next valid story segment from a curated bank
- choose audio and visual family adjustments within authored guardrails
- maintain continuity, motif recurrence, and emotional arc
- emit orchestration plans that downstream systems can apply deterministically

### Score compiler

Responsibilities:

- convert orchestration history and run state into canonical audio and visual score data
- maintain scene timeline and chapter cues
- preserve deterministic output
- feed live runtime and end-of-run exporters

### Audio renderer

Responsibilities:

- manage Strudel runtime inputs
- manage layer families
- constrain pattern density and sample selection
- route through Tone.js or Web Audio buses
- smooth transitions and cue changes

### Visual renderer

Responsibilities:

- manage Hydra patch families
- apply bounded parameter changes
- map ritual state to motion, color, and feedback shifts
- manage scene transitions

### Exporter

Responsibilities:

- serialize canonical run
- generate narrative chronicle
- generate Strudel script
- generate Hydra script
- produce basilisk-av import payload

## State architecture

Recommended slices:

- app shell state
- run state
- narrative state
- ritual state
- orchestration state
- audio state
- visual state
- export state
- developer or debug state

## Suggested implementation stack

- React
- TypeScript
- Vite
- Zustand
- optional XState if scene orchestration needs a heavier state machine
- Tailwind or CSS modules
- Web Audio or Tone.js
- Hydra
- Strudel-compatible generation pipeline

## Suggested folder structure

```text
src/
  app/
    routes/
    layout/
    providers/
  game/
    narrative/
      segments/
      engine/
      responses/
      endings/
    ritual/
      state.ts
      reducers.ts
      selectors.ts
      mapping.ts
    orchestration/
      engine.ts
      planner.ts
      policies.ts
      history.ts
    run/
      runStore.ts
      serialization.ts
  av/
    score/
      compiler.ts
      models.ts
      timeline.ts
    audio/
      engine/
      buses.ts
      scheduler.ts
      renderer.ts
      transitions.ts
      assets.ts
    visuals/
      hydra/
        families/
        renderer.ts
        transitions.ts
    exporters/
      strudelExporter.ts
      hydraExporter.ts
      presetExporter.ts
  ui/
    screens/
    components/
    typography/
    overlays/
  content/
    storySegments/
    symbols/
    audioFamilies/
    visualFamilies/
    orchestration/
  shared/
    types/
    utils/
    constants/
```

## Architectural rule of thumb

Orchestrate from curated banks, then compile intent. Runtime engines should consume a stable score model instead of owning the story logic themselves, and the orchestration layer should arrange rather than freely author the whole experience.

## Related docs

- [Data model](data-model.md)
- [Ritual state and score](../systems/ritual-state-and-score.md)
- [Roadmap](../planning/roadmap.md)
