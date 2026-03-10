# Ritual State And Score

Use this document when defining the hidden variables, transformation rules, and canonical score model that connect narrative play to runtime AV behavior and exported artifacts.

## System concept

The system should follow this pipeline:

Narrative input -> Response interpretation -> Ritual state -> Orchestration plan -> Score model -> Runtime renderers -> Export artifacts

This is the central architectural principle. Basilisk should not treat Hydra and Strudel as uncontrolled engines constantly rewriting themselves. It also should not treat runtime AI as an unrestricted author. Instead, Basilisk should interpret player response into ritual state, let an orchestration layer arrange from curated content banks, generate a stable intermediate score model, and then use renderers to translate that model into runtime behavior and final scripts.

## Hidden ritual variables

Suggested v1 variables:

- `veil`: how close the player is to forbidden perception
- `dread`: accumulated fear and instability
- `communion`: alignment with the occult intelligence
- `witness`: depth of observation and ritual participation
- `static`: distortion, technological corruption, signal instability
- `grace`: unusual calm, surrender, lucidity
- `hunger`: drive toward revelation or transgression

These variables change through player responses, selected segments, and triggered events.

## State model responsibilities

- maintain hidden occult variables
- derive narrative and AV-facing parameters
- smooth transitions
- expose selectors for orchestration, scoring, and renderer updates

## Orchestration intelligence

The orchestration layer is the balancing mechanism between authored determinism and generative variation. It should:

- interpret player response into bounded intent or motif tags
- evaluate which story segments, audio families, and visual families are valid next
- choose arrangements that preserve pacing, continuity, and ritual tone
- emit explicit plan data that downstream score and runtime systems can consume
- remain explainable to the design team and stable for engineering

## Mapping philosophy

State mappings should be interpretable by the design team and stable for engineering. The system should prefer authored ranges, thresholds, and curated content banks over opaque procedural behavior.

### Example mapping directions

- high `dread` increases rhythmic density, tension, and visual instability
- high `veil` increases space distortion, ambience, and recursive depth
- high `communion` increases coherence, recurrence, and motif reuse
- high `static` increases noise, fragmentation, and glitch behavior
- high `grace` softens harshness and transition aggression
- high `witness` increases clarity of symbolic recurrence

## Canonical score model

The score model is the translation layer between orchestration decisions and AV output. It should:

- preserve deterministic output for a given run
- track scene-level cues over time
- remain stable enough to power both runtime playback and export generation
- keep the final generated code readable rather than overfit to runtime internals

## Runtime versus export behavior

### Runtime

- updates should be bounded and smoothed
- orchestration should issue sparse, meaningful plan updates
- renderers should mutate within constrained families
- transitions should avoid abrupt resets where possible

### Export

- exports should reflect the full arc of the run
- exports should reflect the orchestrated segment and cue history, not just final scalar state
- the final artifact should preserve the dominant motifs and families that surfaced
- the exported scripts should be editable and structurally understandable

## Related docs

- [Audio system](audio-system.md)
- [Visual system](visual-system.md)
- [Data model](../implementation/data-model.md)
