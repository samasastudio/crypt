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
- choice evaluation
- event triggering
- ending resolution
- run logging
- symbolic tag accumulation

### Ritual state engine

Responsibilities:

- maintain hidden occult variables
- derive narrative and AV-facing parameters
- smooth transitions
- expose selectors for scoring and renderer updates

### Score compiler

Responsibilities:

- convert run state into canonical audio and visual score data
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
      scenes/
      engine/
      choices/
      endings/
    ritual/
      state.ts
      reducers.ts
      selectors.ts
      mapping.ts
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
    scenes/
    symbols/
    audioFamilies/
    visualFamilies/
  shared/
    types/
    utils/
    constants/
```

## Architectural rule of thumb

Compile intent, do not improvise everything live. Runtime engines should consume a stable score model instead of owning the story logic themselves.

## Related docs

- [Data model](data-model.md)
- [Ritual state and score](../systems/ritual-state-and-score.md)
- [Roadmap](../planning/roadmap.md)
