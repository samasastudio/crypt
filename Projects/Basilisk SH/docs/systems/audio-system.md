# Audio System

Use this document when specifying adaptive sound behavior, audio families, runtime constraints, and export expectations for the Strudel side of Basilisk.

## Audio role

Audio is not a background soundtrack. It is the audible manifestation of the player's relationship with the system, arranged by the orchestration layer from a curated sound bank.

## Runtime strategy

Use Strudel-compatible generated pattern logic, but during gameplay treat the audio engine as a bounded adaptive system directed by orchestration plans rather than direct free generation.

### Recommended implementation

- Tone.js or Web Audio for scheduling and buses
- Strudel-derived pattern layer logic
- orchestration layer that selects family, density band, motif tokens, and transition intent
- pre-authored sample or stem palette
- constrained parameter mutations during play
- compiled full script at end of run

## Audio families

Suggested families for v1:

- Initiation
- Threshold
- Catacomb
- Signal
- Conjuring
- Witness
- Collapse
- Return

Each family should define:

- sample palette
- rhythmic density range
- motif pool
- FX profile
- harmonic mode preferences
- valid state triggers
- orchestration transition notes

## Audio bank and orchestration rules

The audio bank should expose enough structure for the orchestration layer to act like a conductor instead of a generator. Useful authoring dimensions include:

- intensity tiers
- transition-safe layer combinations
- recurring motif hooks
- family handoff rules
- forbidden combinations that break mood or performance

## Audio layers

Prefer 3-6 simultaneous layers at runtime:

- drone bed
- texture or noise bed
- pulse or percussion layer
- motif fragment layer
- ambience field
- occasional stinger bus

## Orchestration and mapping examples

- high `dread` pushes the orchestration layer toward denser pulse states and less stable harmony
- high `veil` encourages wider ambience, slower bloom, and deeper reverb families
- high `communion` increases reuse of recurring motifs and smoother family continuity
- high `static` makes glitch textures and noise modulation more eligible
- high `grace` biases transitions toward softer entries and reduced harshness

## Export behavior

End-of-run Strudel code should:

- reflect the narrative path
- reflect the orchestrated cue timeline, not only aggregate state totals
- encode motifs tied to choices
- remain readable enough to remix
- avoid overlong unreadable output
- preserve a performable structure

## Engineering constraints

- prefer shared FX buses over per-layer duplication
- avoid frequent node churn
- use smooth parameter ramps instead of abrupt reconfiguration
- limit the active layer count to keep the browser stable

## Related docs

- [Ritual state and score](ritual-state-and-score.md)
- [Export and integration](export-and-integration.md)
- [UX, performance, and content pipeline](../implementation/ux-performance-and-content.md)
