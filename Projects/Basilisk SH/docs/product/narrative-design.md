# Narrative Design

Use this document when designing chapters, scenes, choices, endings, or the symbolic logic that drives replayable narrative variation.

## Narrative structure philosophy

The game should feel like moving through chambers of meaning rather than traditional quests. Progression is less about inventory and more about:

- witnessing
- choosing
- sacrificing
- attuning
- transgressing
- interpreting signs

The player should feel guided by an occult intelligence that is arranging the rite in response to them, not by a static branching script and not by a fully unbounded chatbot.

## Suggested chapter pattern for v1

1. Ingress: entry into system, first signal.
2. Threshold: choices introduce ritual alignment.
3. Chamber: deeper symbolic confrontation.
4. Witness: recognition or corruption.
5. Convergence: consequence and ending.

## Scene design principles

Every segment should have:

- strong imagery
- one central symbol
- one emotional shift
- one gameplay consequence
- one AV consequence

## Story bank model

Narrative content should be authored as a bank of reusable but strongly voiced segments. Each segment should carry enough metadata for the orchestration layer to decide when it is appropriate to surface.

Useful segment metadata includes:

- ritual tags
- continuity hooks
- allowed predecessor or successor patterns
- pacing intensity
- ending affinity
- linked audio and visual cue families

## Choice design principles

Player responses should avoid generic RPG morality framing. Better axes:

- resist or surrender
- observe or intervene
- interpret or obey
- preserve self or seek revelation
- conceal or invoke

For v1, free text should be interpreted into bounded intent tags rather than treated like an unrestricted parser.

## Narrative-facing system hooks

Each segment can carry:

- entry effects
- exit effects
- response-gated state changes
- optional conditions
- audio cue references
- visual cue references
- next-scene resolution logic

## Orchestration responsibilities

The orchestration layer should:

- interpret player response into usable intent tags
- choose among valid segment candidates instead of writing whole scenes from scratch
- preserve motif continuity across the run
- vary pacing without breaking authored tone
- resolve endings from accumulated path, symbolic tags, and ritual-state shape

## Ending design

Ending resolution should read as consequence, not score tally. Endings should be driven by a combination of path, symbolic tags, and ritual-state shape instead of a single dominant stat.

## Writing guidance

- Keep text concrete even when mysterious.
- Let symbols recur so the player can feel pattern recognition.
- Avoid over-explaining hidden systems during normal play.
- Make each segment legible on first read, but richer on replay.

## Related docs

- [Experience loop](experience-loop.md)
- [Ritual state and score](../systems/ritual-state-and-score.md)
- [Export and integration](../systems/export-and-integration.md)
