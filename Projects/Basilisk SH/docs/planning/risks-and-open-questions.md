# Risks And Open Questions

Use this document to track implementation risks, design guardrails, and unresolved decisions that should be answered before or during the first build phases.

## Known risks

### Risk 1: Too much runtime complexity

If Basilisk tries to be game, live-coding tool, exporter, and AV workstation simultaneously, it may become unstable.

Mitigation:
Keep Basilisk constrained and guided. Let basilisk-av handle open-ended experimentation.

### Risk 2: Generated output feels arbitrary

If state mappings are weak, export will feel disconnected from the narrative.

Mitigation:
Make symbolic choices map to motif tokens, palettes, and cue families in a deliberate way.

### Risk 3: Web performance issues

Hydra plus audio plus UI may get heavy.

Mitigation:
Bound complexity, keep one active visual family, limit audio layers, and share FX buses.

### Risk 4: Story too vague

Occult fiction can become empty if it only gestures at mystery.

Mitigation:
Each scene needs concrete symbols, concrete stakes, and concrete consequences.

## Implementation principles

1. Compile intent, do not improvise everything live.
2. Prefer templates plus mutation over unconstrained generation.
3. Narrative consequence must affect AV consequence.
4. Export should feel like a relic, not a logfile.
5. Basilisk is the rite; basilisk-av is the laboratory.

## Open questions to resolve

### Authoring and content

- What authoring format should scenes use in practice: JSON, TypeScript, or MDX?
- How much scene variation is authored versus derived from ritual state?
- How many unique endings should ship in the first public release?

### Runtime systems

- What level of determinism should be guaranteed across browsers for seeded runs?
- Which Strudel and Hydra feature subsets are safe to rely on for v1?
- How should transition smoothing be specified so AV behavior remains consistent scene to scene?

### Export and integration

- What exact transport mechanism should power the basilisk-av handoff: URL payload, local bundle, clipboard flow, or multiple options?
- How should export versioning work so future Basilisk changes do not break old basilisk-av imports?
- What metadata is required for basilisk-av to restore a run as a meaningful starting point instead of just loading code?

### UX and product

- How hidden should ritual state remain outside of debug mode?
- What is the minimum viable mobile behavior: unsupported, degraded, or selectively supported?
- How much of the ending screen should feel like narrative closure versus tool-like export UI?

## Recommended next spec pass

If the next step is implementation prep, the highest-value additions would be:

1. A concrete scene schema with one or two fully authored example scenes.
2. A state-to-score mapping table for each ritual variable.
3. An export payload contract for basilisk-av.
4. A vertical-slice build checklist that maps this spec to engineering tasks.
