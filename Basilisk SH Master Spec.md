# Basilisk Product Specification

## 1. Product overview

**Basilisk** is a browser-based occult text adventure that uses an orchestration intelligence to generate an audiovisual ritual from the player's responses. As the player moves through the narrative, the orchestration layer selects and sequences story segments, sound behaviors, and visual mutations from curated banks, then compiles the journey into a structured **sound script** and **visual script**. At the end of a run, Basilisk exports these outputs into **basilisk-av**, where the player can continue exploring, performing, and modifying the generated Strudel and Hydra code.

Basilisk is not just a narrative game and not just a live-coding toy. It is a **ritual journey that becomes an instrument**.

### Core product promise

A player enters an eerie text-based world, responds to an unseen ritual intelligence, accumulates hidden occult states, experiences story, sound, and visuals that are arranged in real time, and leaves with a playable artifact generated from the path they co-authored.

---

## 2. Product vision

Basilisk should feel like:

* a haunted terminal
* a ceremonial text adventure
* a personalized sound ritual
* a generator of playable creative artifacts
* an on-ramp into the basilisk-av ecosystem

The product sits between:

* text adventure
* generative music system
* reactive visual instrument
* exportable creative coding tool

### Vision statement

**Basilisk transforms player response into an orchestrated audiovisual score, then hands that score back to the player as a script they can perform, remix, and study.**

---

## 3. Product goals

### Primary goals

1. Deliver a compelling occult text adventure experience in the browser.
2. Generate adaptive audio and visuals during play with strong mood and continuity.
3. Produce a meaningful end-of-run artifact.
4. Seamlessly hand the player into basilisk-av.
5. Establish a reusable engine for future chapters, content packs, and ritual modes.

### Secondary goals

1. Reinforce your broader Basilisk brand and AV ecosystem.
2. Make the generated output feel authored, not random.
3. Keep runtime performance solid on desktop web and acceptable on modern mobile browsers.
4. Make the system extensible for more scenes, endings, audio families, and visual families.

### Non-goals for v1

1. Full open-ended parser gameplay.
2. Unlimited live coding during core gameplay.
3. Massive branching narrative tree.
4. Multiplayer or social collaboration.
5. Native mobile app at launch.

---

## 4. Target audience

### Primary audience

* Players who enjoy atmospheric text adventures
* People drawn to occult, surreal, or ritualistic aesthetics
* Experimental music and live-coding adjacent users
* People who enjoy authored but replayable interactive art

### Secondary audience

* Existing basilisk-av users
* Strudel/Hydra curious creatives
* People who like â€œartifact-generatingâ€ experiences
* Design-forward web art enthusiasts

### User motivations

* immersion
* mood
* discovery
* replayability
* collecting generated scripts
* turning play into creative output

---

## 5. Product pillars

### 1. Ritual atmosphere

Everything should feel ceremonial, uncanny, and intentional.

### 2. Choice becomes score

Player responses do not only affect text. They affect sound, visuals, pacing, and export structure through an orchestration layer.

### 3. Constrained generativity

The output should feel alive, but never chaotic or broken. Basilisk should arrange from curated banks rather than invent the entire experience from scratch at runtime.

### 4. Artifact afterlife

A run should leave behind something worth keeping and reusing.

### 5. Web-native elegance

The experience should feel premium in-browser, not like a compromised prototype.

---

## 6. Core experience loop

### During play

1. Player enters Basilisk.
2. Player reads the current passage and responds through a ritual prompt, authored choice set, or hybrid input.
3. An orchestration layer interprets that response against the current ritual state, pacing, and run history.
4. Basilisk selects the next story segment and bounded audio and visual adjustments from curated banks.
5. Hidden ritual state and score structure update.
6. Story advances through scenes and chambers while the run accumulates symbolic, musical, and visual structure.

### End of run

1. Player reaches an ending.
2. Basilisk summarizes what was witnessed, chosen, and invoked.
3. The game compiles:

   * narrative chronicle
   * Strudel script
   * Hydra script
   * run seed / session preset
4. Player can export into basilisk-av.

### Post-run

1. Player opens the generated output in basilisk-av.
2. Player experiments with the resulting AV patch.
3. Player can preserve, remix, or mutate the run.

---

## 7. Experience design summary

### Player-facing fantasy

â€œI entered a forbidden system, passed through an occult journey, and left with a coded ritual generated from my path.â€

### Emotional arc

* curiosity
* unease
* pattern recognition
* dread or devotion
* revelation
* possession of artifact

### Tone

* mysterious
* literary
* ceremonial
* technical but poetic
* minimal, not verbose
* unsettling without becoming campy

---

## 8. Functional scope

## 8.1 Narrative gameplay

The game presents a sequence of text-driven scenes or segments. Each segment includes:

* descriptive text
* optional symbolic glyphs / micro-UI elements
* 2-4 authored responses, a short ritual text prompt, or a hybrid response mode
* hidden state modifications
* optional scene events
* audiovisual cue changes
* orchestration tags that help the system choose what can surface next
* audiovisual cue changes

### Narrative structure

For v1:

* one contained run
* 10â€“15 minutes average
* 8â€“15 scenes
* 3â€“5 endings
* moderate replayability through state differences and choice variations

## 8.2 Hidden ritual systems

The game maintains hidden state variables that drive both narrative and AV output.

Example hidden stats:

* **Veil**: how close the player is to forbidden perception
* **Dread**: accumulated fear and instability
* **Communion**: alignment with the occult intelligence
* **Witness**: depth of observation and ritual participation
* **Static**: distortion, technological corruption, signal instability
* **Grace**: unusual calm, surrender, lucidity
* **Hunger**: drive toward revelation or transgression

These variables change through choices, scenes, and triggered events.

## 8.3 Adaptive audiovisual engine

During play:

* visuals are rendered with Hydra
* sound is rendered via Strudel/Tone.js-backed runtime approach
* both are arranged by an orchestration layer operating on curated banks
* runtime updates are bounded and smoothed

## 8.4 Export system

At the end of the run, Basilisk exports:

* **Chronicle**: textual summary of the journey
* **Sound Script**: generated Strudel code
* **Vision Script**: generated Hydra code
* **Seed of Return**: canonical run seed/config/session payload

## 8.5 basilisk-av integration

Player can move the generated artifact into basilisk-av where:

* Strudel pane loads generated code
* Hydra pane loads generated code
* shared session metadata initializes defaults
* asset palette is preloaded from Basilisk-compatible sounds

---

## 9. System concept

The system should follow this pipeline:

**Narrative input -> Response interpretation -> Ritual state -> Orchestration plan -> Score model -> Runtime renderers -> Export artifacts**

This is the central architectural principle.

The game should not directly treat Hydra and Strudel as uncontrolled engines constantly rewriting themselves. It also should not treat runtime AI as an unrestricted author. Instead, Basilisk should interpret player response into ritual state, let an orchestration layer arrange from curated content banks, generate a **stable intermediate score model**, then use renderers to translate that model into runtime behavior and final scripts.

---

## 10. High-level architecture

## 10.1 Front-end application layer

Responsibilities:

* routing / shell
* UI rendering
* narrative display
* choice controls
* overlays / debug / transitions
* export presentation
* basilisk-av handoff UI

Suggested stack:

* React
* TypeScript
* Vite
* Zustand
* Tailwind or similar styling layer

## 10.2 Narrative engine

Responsibilities:

* scene progression
* response intake and normalization
* event triggering
* ending resolution
* run logging
* symbolic tag accumulation

## 10.3 Ritual state engine

Responsibilities:

* maintain hidden occult variables
* derive narrative and AV-facing parameters
* smooth transitions
* expose selectors for orchestration, scoring, and renderer updates

## 10.4 Orchestration engine

Responsibilities:

* interpret player response in context of ritual state, pacing, and run history
* select the next valid story segment from a curated bank
* choose audio and visual family adjustments within authored guardrails
* maintain continuity, motif recurrence, and emotional arc
* emit orchestration plans that downstream systems can apply deterministically

## 10.5 Score compiler

Responsibilities:

* convert orchestration history and run state into canonical audio/visual score data
* maintain scene timeline / chapter cues
* preserve deterministic output
* feed live runtime and end-of-run exporters

## 10.6 Audio renderer

Responsibilities:

* manage Strudel runtime inputs
* manage layer families
* constrain pattern density and sample selection
* route through Tone.js/Web Audio buses
* smooth transitions and cue changes

## 10.7 Visual renderer

Responsibilities:

* manage Hydra patch families
* apply bounded parameter changes
* map ritual state to motion/color/feedback shifts
* manage scene transitions

## 10.8 Exporter

Responsibilities:

* serialize canonical run
* generate narrative chronicle
* generate Strudel script
* generate Hydra script
* produce basilisk-av import payload

---

## 11. Data model

## 11.1 Core run model

```ts
type BasiliskRun = {
  id: string
  seed: string
  startedAt: string
  endedAt?: string
  version: string
  scenesVisited: SceneVisit[]
  choicesMade: ChoiceRecord[]
  ritualStateHistory: RitualStateSnapshot[]
  audioScore: AudioScore
  visualScore: VisualScore
  ending: EndingResult
  tags: string[]
}
```

## 11.2 Narrative scene model

```ts
type Scene = {
  id: string
  title: string
  body: string[]
  choices: Choice[]
  entryEffects?: RitualStateDelta[]
  exitEffects?: RitualStateDelta[]
  audioCue?: AudioCueRef
  visualCue?: VisualCueRef
  conditions?: SceneCondition[]
  nextSceneResolver?: string
}
```

## 11.3 Choice model

```ts
type Choice = {
  id: string
  label: string
  description?: string
  effects: RitualStateDelta[]
  tags?: string[]
  nextSceneId?: string
  conditions?: SceneCondition[]
}
```

## 11.4 Ritual state model

```ts
type RitualState = {
  veil: number
  dread: number
  communion: number
  witness: number
  static: number
  grace: number
  hunger: number
  chapter: string
  chamber: string
  discoveredSymbols: string[]
  invokedNames: string[]
  chosenTags: string[]
}
```

## 11.5 Audio score model

```ts
type AudioScore = {
  tempo: number
  root: string
  mode: 'aeolian' | 'dorian' | 'phrygian' | 'locrian'
  density: number
  textureProfile: string[]
  pulseProfile: string[]
  motifTokens: string[]
  sceneCues: AudioSceneCue[]
  tensionCurve: number[]
  assetPalette: string[]
}
```

## 11.6 Visual score model

```ts
type VisualScore = {
  family: string
  palette: string[]
  motion: number
  contrast: number
  feedback: number
  geometryTags: string[]
  sceneCues: VisualSceneCue[]
}
```

## 11.7 Export payload

```ts
type BasiliskExport = {
  run: BasiliskRun
  chronicle: string
  strudelCode: string
  hydraCode: string
  basiliskAvPreset: BasiliskAvPreset
}
```

---

## 12. Narrative design framework

## 12.1 Narrative structure philosophy

The game should feel like moving through chambers of meaning rather than traditional quests. Progression is less about inventory and more about:

* witnessing
* choosing
* sacrificing
* attuning
* transgressing
* interpreting signs

## 12.2 Content structure for v1

Suggested chapter pattern:

1. **Ingress** â€” entry into system, first signal
2. **Threshold** â€” choices introduce ritual alignment
3. **Chamber** â€” deeper symbolic confrontation
4. **Witness** â€” recognition or corruption
5. **Convergence** â€” consequence and ending

## 12.3 Scene design principles

Every scene should have:

* strong imagery
* one central symbol
* one emotional shift
* one gameplay consequence
* one AV consequence

## 12.4 Choice design principles

Choices should avoid generic RPG morality framing. Better axes:

* resist / surrender
* observe / intervene
* interpret / obey
* preserve self / seek revelation
* conceal / invoke

---

## 13. Audio design specification

## 13.1 Audio role

Audio is not a background soundtrack. It is the audible manifestation of the playerâ€™s relationship with the system.

## 13.2 Runtime strategy

Use Strudel-compatible generated pattern logic, but during gameplay treat the audio engine as a **bounded adaptive system**.

### Recommended implementation

* Tone.js / Web Audio for scheduling and buses
* Strudel-derived pattern layer logic
* pre-authored sample/stem palette
* constrained parameter mutations during play
* compiled full script at end of run

## 13.3 Audio families

Suggested audio families for v1:

* **Initiation**
* **Threshold**
* **Catacomb**
* **Signal**
* **Conjuring**
* **Witness**
* **Collapse**
* **Return**

Each family includes:

* sample palette
* rhythmic density range
* motif pool
* FX profile
* harmonic mode preferences
* valid state triggers

## 13.4 Audio layers

At runtime, prefer 3â€“6 simultaneous layers:

* drone bed
* texture/noise bed
* pulse/percussion layer
* motif fragment layer
* ambience field
* occasional stinger bus

## 13.5 Audio mapping examples

* high **dread** increases pulse density and harmonic instability
* high **veil** opens reverb and widens ambience
* high **communion** introduces recurring motif coherence
* high **static** adds glitch texture and noise modulation
* high **grace** reduces harshness and slows transition intensity

## 13.6 Audio export behavior

End-of-run Strudel code should:

* reflect narrative path
* encode motifs tied to choices
* remain readable enough to remix
* avoid overlong unreadable output
* preserve a performable structure

---

## 14. Visual design specification

## 14.1 Visual role

Visuals should feel like a living ritual display rather than game illustration. Hydra should behave like an unstable occult signal surface.

## 14.2 Runtime strategy

Hydra should run a bounded patch family system with controlled parameter mutation rather than arbitrary code churn every scene.

## 14.3 Visual families

Suggested visual families:

* **Veil Bloom**
* **Terminal Sigil**
* **Static Chapel**
* **Black Water**
* **Glass Eye**
* **Red Chamber**
* **Ritual Grid**

Each family includes:

* base Hydra patch template
* palette constraints
* feedback range
* movement range
* scene transition rules
* symbolic associations

## 14.4 Visual mapping examples

* high **witness** increases clarity of recurring forms
* high **static** increases fragmentation and interference
* high **dread** intensifies contrast and destabilizes geometry
* high **communion** creates recurrence and symmetry
* high **veil** deepens recursive feedback and space distortion

## 14.5 Export behavior

Hydra output should:

* capture the runâ€™s dominant visual grammar
* remain editable
* preserve family identity
* include clear sections or comments where possible

---

## 15. basilisk-av integration spec

## 15.1 Integration goal

The transfer into basilisk-av should feel deliberate and magical, not like a manual copy-paste utility.

## 15.2 Integration requirements

* compatible export format
* preloaded sound palette from Basilisk
* session metadata preserved
* direct import or pasteable script flow
* ability to resume generated score as a starting point

## 15.3 Import options

Preferred hierarchy:

1. one-click open in basilisk-av via shared preset/session payload
2. copy Strudel and Hydra scripts separately
3. download export bundle as JSON/text package

## 15.4 Shared session model

The session should include:

* run seed
* ritual tags
* sound asset references
* tempo/root/mode
* Hydra family/palette references
* original chronicle summary

---

## 16. UX specification

## 16.1 Core screens

1. Landing / invocation screen
2. Main narrative chamber
3. Transition states / chapter markers
4. Ending / revelation screen
5. Export / relic screen
6. basilisk-av handoff screen

## 16.2 Main narrative screen

Should include:

* primary text panel
* choice list
* subtle ritual metadata
* ambient Hydra canvas
* minimal status hints if any
* optional hidden debug toggle in development mode

## 16.3 UX principles

* minimal chrome
* no clutter
* restrained animation
* readable typography
* strong pacing
* avoid over-explaining systems
* keep occult stats hidden in normal play

## 16.4 Ending screen framing

The ending output should be ceremonial. Suggested labels:

* **The Chronicle**
* **The Sound Script**
* **The Vision Script**
* **The Seed of Return**

This adds identity and memorability to the export flow.

---

## 17. Technical architecture

## 17.1 Front-end stack

* React
* TypeScript
* Vite
* Zustand
* optional XState if you want heavier scene-state orchestration
* Tailwind or CSS modules
* Web Audio / Tone.js
* Hydra
* Strudel-compatible generation pipeline

## 17.2 State architecture

Recommended state slices:

* app shell state
* run state
* narrative state
* ritual state
* audio state
* visual state
* export state
* developer/debug state

## 17.3 Suggested folder structure

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

---

## 18. Runtime performance requirements

## 18.1 Performance goals

Desktop web should be the primary target.

### Desired baseline

* smooth text transitions
* stable Hydra rendering
* clean audio playback
* no audible pops on scene transitions
* modest memory footprint
* fast enough initial load to feel intentional

## 18.2 Audio constraints

* 3â€“6 simultaneous audio layers
* shared FX buses
* limited heavy effects
* lazy-load larger asset groups
* avoid frequent node churn
* smooth parameter ramps instead of abrupt reconfiguration

## 18.3 Visual constraints

* one active Hydra family at a time
* bounded complexity
* limited full patch rewrites
* parameter mutation preferred over complete re-instantiation

## 18.4 Mobile expectations

Modern mobile browsers may support simplified play, but v1 should optimize for desktop-first polish.

---

## 19. Content pipeline

## 19.1 Narrative content format

Scenes should live in structured data files, not hardcoded components.

Recommended format:

* JSON, TS objects, or MDX-backed structured content

## 19.2 Audio content pipeline

Each audio family should define:

* asset references
* allowable tempo ranges
* motif tokens
* sample categories
* compatible ritual states
* export grammar hooks

## 19.3 Visual content pipeline

Each visual family should define:

* base Hydra patch template
* state mappings
* palette options
* transition behaviors
* export formatter hooks

---

## 20. Export generation specification

## 20.1 Chronicle generation

Chronicle should summarize:

* path taken
* dominant symbolic themes
* ending type
* notable choices
* overall ritual signature

Tone should be poetic but legible.

## 20.2 Strudel generation

The exporter should transform the canonical audio score into:

* one readable script
* sectioned pattern blocks
* comments or labels where useful
* a stable starting patch for basilisk-av

## 20.3 Hydra generation

The exporter should transform the canonical visual score into:

* one readable Hydra patch
* optional section markers
* reusable base structure
* editable parameters

## 20.4 Preset generation

The basilisk-av preset should include:

* panel content
* metadata
* sample palette linkage
* run ID / seed
* compatible defaults

---

## 21. Replayability specification

Replayability should come from:

* different ritual stat accumulation
* alternate scene variants
* different endings
* different AV outputs
* different exports
* different motifs and visual families surfacing

The goal is not huge combinatorial branching for its own sake. The goal is meaningful variance in the generated artifact.

---

## 22. Success metrics

## 22.1 Product success

* players finish a run
* players replay to see alternate outputs
* players export artifacts
* players open outputs in basilisk-av
* outputs feel distinct and worth keeping

## 22.2 Experience success

* players describe the experience as atmospheric and coherent
* AV output feels connected to choices
* export feels magical rather than gimmicky
* generated scripts feel remixable

## 22.3 Technical success

* acceptable performance on target browsers
* no major audio instability
* no frequent Hydra lockups
* deterministic export generation

---

## 23. MVP definition

## v1 MVP includes

* one complete 10â€“15 minute run
* 8â€“15 scenes
* 3â€“5 endings
* hidden ritual state system
* orchestration engine for story and AV arrangement
* curated story, audio, and visual banks
* bounded adaptive Hydra visuals
* bounded adaptive Strudel/Tone-style sound system
* end-of-run chronicle
* end-of-run Strudel script
* end-of-run Hydra script
* basilisk-av compatible export payload

## v1 excludes

* full freeform text parser
* fully unconstrained runtime story generation
* giant branching story map
* user-authored in-game code editing
* account system
* cloud save
* native app packaging

---

## 24. Roadmap

## Phase 1: Vertical slice

Build:

* one narrative path with orchestration hooks
* one visual family
* one audio family
* hidden ritual state
* one orchestration policy set
* basic export prototype

Goal:
prove the loop works

## Phase 2: MVP

Build:

* complete v1 run
* multiple endings
* multiple story segment banks
* multiple AV families
* polished export flow
* basilisk-av import compatibility

Goal:
ship a compelling first public version

## Phase 3: Expansion

Build:

* more chapters
* alternate rituals
* grimoire/archive of prior runs
* richer export bundles
* improved remix tooling inside basilisk-av

Goal:
expand the universe and strengthen retention

---

## 25. Risks and mitigations

## Risk 1: Too much runtime complexity

If Basilisk tries to be game, live-coding tool, exporter, and AV workstation simultaneously, it may become unstable.

### Mitigation

Keep Basilisk constrained and guided. Let basilisk-av handle open-ended experimentation.

## Risk 2: Generated output feels arbitrary

If orchestration policies are weak, output will feel disconnected from the narrative even if the ritual state model is sound.

### Mitigation

Make player responses map to intent tags, then map those tags to segment candidates, motif tokens, palettes, and cue families in a deliberate way.

## Risk 3: Web performance issues

Hydra plus audio plus UI may get heavy.

### Mitigation

Bound complexity, keep one active visual family, limit audio layers, share FX buses.

## Risk 4: Story too vague

Occult fiction can become empty if it only gestures at mystery.

### Mitigation

Each scene needs concrete symbols, concrete stakes, and concrete consequences.

## Risk 5: Orchestration dilutes authored voice

If the orchestration layer is too free, the experience may lose tone consistency and feel like generic AI assembly.

### Mitigation

Constrain orchestration to curated banks, explicit policies, and strong authored segment voice.

---

## 26. Design principles for implementation

1. **Orchestrate from curated banks, don't free-write the whole experience live.**
2. **Prefer templates plus mutation over unconstrained generation.**
3. **Narrative consequence must affect AV consequence.**
4. **Export should feel like a relic, not a logfile.**
5. **Basilisk is the rite; basilisk-av is the laboratory.**

---

## 27. Final product statement

**Basilisk** is a browser-based occult text adventure that turns player response into an orchestrated audiovisual ritual. Through hidden symbolic state, curated story banks, adaptive sound, and reactive Hydra visuals, each run produces a unique chronicle and a remixable Strudel/Hydra script. The experience culminates in a handoff to **basilisk-av**, where the player's journey becomes an instrument.

If you want, next Iâ€™ll turn this into either a **Confluence-style spec**, a **GitHub README/product brief**, or a **task-by-task engineering roadmap with epics and acceptance criteria**.
