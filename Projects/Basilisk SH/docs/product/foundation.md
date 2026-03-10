# Product Foundation

Use this document when defining the product promise, audience, scope boundaries, and design values that should stay stable as implementation details evolve.

## Product overview

Basilisk is a browser-based occult text adventure that uses an orchestration intelligence to arrange an audiovisual ritual from the player's responses. As the player moves through the narrative, the orchestration layer selects and sequences story segments, sound behaviors, and visual mutations from curated banks, then compiles the journey into a structured sound script and visual script. At the end of a run, Basilisk exports these outputs into basilisk-av, where the player can continue exploring, performing, and modifying the generated Strudel and Hydra code.

Basilisk is not just a narrative game and not just a live-coding toy. It is a ritual journey that becomes an instrument.

## Core product promise

A player enters an eerie text-based world, responds to an unseen ritual intelligence, accumulates hidden occult states, experiences story, sound, and visuals that are arranged in real time, and leaves with a playable artifact generated from the path they co-authored.

## Vision

Basilisk should feel like:

- a haunted terminal
- a ceremonial text adventure
- a personalized sound ritual
- a generator of playable creative artifacts
- an on-ramp into the basilisk-av ecosystem

The product sits between:

- text adventure
- generative music system
- reactive visual instrument
- exportable creative coding tool

### Vision statement

Basilisk transforms player response into an orchestrated audiovisual score, then hands that score back to the player as a script they can perform, remix, and study.

## Product goals

### Primary goals

1. Deliver a compelling occult text adventure experience in the browser.
2. Generate adaptive audio and visuals during play with strong mood, continuity, and authored coherence.
3. Produce a meaningful end-of-run artifact.
4. Seamlessly hand the player into basilisk-av.
5. Establish a reusable orchestration engine for future chapters, content packs, and ritual modes.

### Secondary goals

1. Reinforce the broader Basilisk brand and AV ecosystem.
2. Make the generated output feel authored, not random.
3. Keep runtime performance solid on desktop web and acceptable on modern mobile browsers.
4. Make the system extensible for more story banks, endings, audio families, and visual families.

### Non-goals for v1

1. Full open-ended parser gameplay.
2. Unlimited live coding during core gameplay.
3. Massive branching narrative tree.
4. Multiplayer or social collaboration.
5. Native mobile app at launch.
6. Unbounded runtime generation that ignores authored content banks and guardrails.

## Target audience

### Primary audience

- players who enjoy atmospheric text adventures
- people drawn to occult, surreal, or ritualistic aesthetics
- experimental music and live-coding adjacent users
- people who enjoy authored but replayable interactive art

### Secondary audience

- existing basilisk-av users
- Strudel/Hydra-curious creatives
- people who like artifact-generating experiences
- design-forward web art enthusiasts

### User motivations

- immersion
- mood
- discovery
- replayability
- collecting generated scripts
- turning play into creative output

## Product pillars

### Ritual atmosphere

Everything should feel ceremonial, uncanny, and intentional.

### Choice becomes score

Player responses do not only affect text. They affect sound, visuals, pacing, and export structure through an orchestration layer.

### Constrained generativity

The output should feel alive, but never chaotic or broken. Basilisk should arrange from curated banks rather than invent the entire experience from scratch at runtime.

### Artifact afterlife

A run should leave behind something worth keeping and reusing.

### Web-native elegance

The experience should feel premium in-browser, not like a compromised prototype.
