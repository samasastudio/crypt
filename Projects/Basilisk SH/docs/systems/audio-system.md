# Audio System

Use this document when specifying adaptive sound behavior, audio families, runtime constraints, and export expectations for the Strudel side of Basilisk.

## Audio role

Audio is not a background soundtrack. It is the audible manifestation of the player's relationship with the system.

## Runtime strategy

Use Strudel-compatible generated pattern logic, but during gameplay treat the audio engine as a bounded adaptive system.

### Recommended implementation

- Tone.js or Web Audio for scheduling and buses
- Strudel-derived pattern layer logic
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

## Audio layers

Prefer 3-6 simultaneous layers at runtime:

- drone bed
- texture or noise bed
- pulse or percussion layer
- motif fragment layer
- ambience field
- occasional stinger bus

## Mapping examples

- high `dread` increases pulse density and harmonic instability
- high `veil` opens reverb and widens ambience
- high `communion` introduces recurring motif coherence
- high `static` adds glitch texture and noise modulation
- high `grace` reduces harshness and slows transition intensity

## Export behavior

End-of-run Strudel code should:

- reflect the narrative path
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
