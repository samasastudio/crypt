# Export And Integration

Use this document when specifying end-of-run artifact generation, export bundle shape, and the handoff into basilisk-av.

## Export goals

The ending flow should feel ceremonial. The exported result should feel like a relic, not a logfile.

## End-of-run outputs

Basilisk should export:

- Chronicle: textual summary of the journey
- Sound Script: generated Strudel code
- Vision Script: generated Hydra code
- Seed of Return: canonical run seed, config, or session payload

## Chronicle generation

Chronicle should summarize:

- path taken
- dominant symbolic themes
- ending type
- notable choices
- notable orchestration turns
- overall ritual signature

Tone should be poetic but legible.

## Strudel generation

The exporter should transform the canonical audio score into:

- one readable script
- sectioned pattern blocks
- comments or labels where useful
- a stable starting patch for basilisk-av

## Hydra generation

The exporter should transform the canonical visual score into:

- one readable Hydra patch
- optional section markers
- reusable base structure
- editable parameters

## basilisk-av integration goal

The transfer into basilisk-av should feel deliberate and magical, not like a manual copy-paste utility.

## Integration requirements

- compatible export format
- preloaded sound palette from Basilisk
- session metadata preserved
- direct import or pasteable script flow
- ability to resume the generated score as a starting point

## Import hierarchy

Preferred order:

1. One-click open in basilisk-av via shared preset or session payload.
2. Copy Strudel and Hydra scripts separately.
3. Download export bundle as JSON or text package.

## Shared session model

The session should include:

- run seed
- ritual tags
- sound asset references
- tempo, root, and mode
- Hydra family and palette references
- orchestration history or condensed orchestration signature
- original chronicle summary

## Related docs

- [Ritual state and score](ritual-state-and-score.md)
- [Audio system](audio-system.md)
- [Visual system](visual-system.md)
- [Data model](../implementation/data-model.md)
