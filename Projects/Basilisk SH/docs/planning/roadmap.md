# Roadmap

Use this document when deciding what to build first, where MVP boundaries sit, and how to sequence delivery.

## MVP definition

### v1 includes

- one complete 10-15 minute run
- 8-15 scenes
- 3-5 endings
- hidden ritual state system
- orchestration engine for story and AV arrangement
- curated story, audio, and visual banks
- bounded adaptive Hydra visuals
- bounded adaptive Strudel or Tone-style sound system
- end-of-run chronicle
- end-of-run Strudel script
- end-of-run Hydra script
- basilisk-av compatible export payload

### v1 excludes

- full freeform text parser
- fully unconstrained runtime story generation
- giant branching story map
- user-authored in-game code editing
- account system
- cloud save
- native app packaging

## Delivery model

### Agent-sized deliverable rules

- each deliverable should fit a single focused agent pass with one primary output
- each deliverable should touch one main surface area: narrative, orchestration, audio, visuals, runtime shell, or export
- if work spans multiple systems, split it into separate deliverables plus one integration deliverable
- each deliverable must leave behind a reviewable artifact, not just a status update
- each phase ends with a checkpoint where we explicitly choose to continue, pivot, or cut scope

### Standard validation gate

Every deliverable should close with all of the following:

1. a concrete artifact exists and is linked in the repo
2. the acceptance checks for that deliverable are run and documented
3. any new assumptions, risks, or follow-up tasks are added to the relevant planning docs
4. the result is small enough that a teammate can review it without reading the whole project

### Standard quality approval

A deliverable is approved only when it is:

- correct enough to support the next step without hidden blockers
- coherent with the product tone and curated-orchestration constraints
- bounded enough to avoid accidental expansion into adjacent systems
- observable enough that we can demo or inspect the result quickly
- handoff-ready for the next agent without verbal context

## Delivery phases

### Phase 1: Vertical slice

Goal:
prove the core loop works in one short, reviewable path

#### Deliverable 1.1: Scene slice package

Build:

- 3-4 connected scenes with choices, copy, and a provisional ending beat
- clear input and output shape for each scene
- authored intent tags for downstream orchestration

Validation gate:

- the scenes can be played from start to end in a simple stub or paper-flow
- every choice maps to explicit intent tags
- tone, stakes, and symbolism are concrete enough to review

Quality approval:

- narrative review confirms the slice feels specific rather than vague
- no scene requires undefined runtime systems to understand its purpose

#### Deliverable 1.2: Ritual state and orchestration slice

Build:

- one hidden ritual state model for the vertical slice
- one response-to-intent map
- one intent-to-story, audio, and visual policy table

Validation gate:

- a reviewer can trace any scene choice to state change and output consequence
- orchestration rules are deterministic for a fixed seed or clearly bounded where variation is allowed

Quality approval:

- policy review confirms outputs feel authored rather than arbitrary
- open questions are logged instead of being buried inside the rules

#### Deliverable 1.3: Audio family slice

Build:

- one bounded audio family with a minimal motif set
- scene transition behavior for the slice
- exportable representation for the generated audio outcome

Validation gate:

- audio reacts across the full slice without instability
- layer count, timing, and FX remain within defined bounds

Quality approval:

- listening review confirms mood continuity across the slice
- generated audio output is understandable enough to remix later

#### Deliverable 1.4: Visual family slice

Build:

- one bounded Hydra visual family
- mutation rules tied to ritual state or intent tags
- safe defaults and reset behavior for scene transitions

Validation gate:

- visuals run across the slice without lockups or runaway complexity
- scene changes produce visible but controlled variation

Quality approval:

- visual review confirms the family feels intentional and on-theme
- complexity budget is documented so later content does not exceed it

#### Deliverable 1.5: Runtime loop shell

Build:

- playable shell for scene progression, choice capture, and orchestration calls
- basic UI treatment for the haunted-terminal feel
- instrumentation or debug view for inspecting hidden state during review

Validation gate:

- one full vertical-slice run can be completed in-browser without manual intervention
- debug output is sufficient to verify scene, state, and orchestration transitions

Quality approval:

- runtime review confirms the shell is usable for iteration, not just a throwaway prototype
- UI remains legible and supports the intended tone

#### Deliverable 1.6: Export proof

Build:

- one end-of-run chronicle
- one generated Strudel script
- one generated Hydra script
- one prototype basilisk-av payload

Validation gate:

- export artifacts are produced reliably at the end of the slice
- at least one sample payload can be inspected for structure and completeness

Quality approval:

- export review confirms the artifacts feel like relics, not raw logs
- contract gaps are documented before Phase 2 begins

#### Phase 1 exit gate

- a new teammate can play the slice and explain how choice becomes score
- the slice demonstrates narrative, audio, visual, and export continuity in one run
- the team explicitly decides whether the orchestration approach is strong enough to scale

### Phase 2: MVP

Goal:
ship a compelling first public version without losing the clarity of the vertical slice

#### Deliverable 2.1: Full run narrative bank

Build:

- the complete 10-15 minute run with 8-15 scenes
- authored segment variants where replay value matters most
- scene metadata kept aligned with orchestration needs

Validation gate:

- the full run can be completed from intro to ending without missing content links
- scene count, pacing, and branching remain inside MVP scope

Quality approval:

- narrative review confirms the run sustains tension and clarity across the full duration
- content bank remains compact enough to maintain without a giant branch map

#### Deliverable 2.2: Ending set

Build:

- 3-5 endings with clear ritual-state conditions
- ending-specific chronicle language and artifact framing

Validation gate:

- each ending can be deliberately triggered through test paths
- ending differences are meaningful in both story and exported output

Quality approval:

- ending review confirms outcomes feel earned, not cosmetic
- no ending depends on hidden logic that cannot be explained in debug mode

#### Deliverable 2.3: AV family expansion

Build:

- additional audio families
- additional visual families
- policy rules for when and how families can swap or blend

Validation gate:

- at least two distinct run profiles produce recognizably different AV outcomes
- transitions remain stable when families change

Quality approval:

- AV review confirms variety without losing product identity
- family definitions stay bounded enough to avoid performance regressions

#### Deliverable 2.4: Orchestration tuning and replay pass

Build:

- tuned weighting, pacing, and variation rules for the full run
- debug scenarios or fixtures for high-risk paths

Validation gate:

- repeated seeded runs are reproducible
- repeated unseeded runs show meaningful variation without breaking coherence

Quality approval:

- orchestration review confirms output is deliberate and replayable
- edge cases and failure modes are logged with clear severity

#### Deliverable 2.5: Export contract and basilisk-av handoff

Build:

- stable export payload schema
- versioning rules
- import compatibility checks with basilisk-av expectations

Validation gate:

- representative exports can be parsed by the receiving workflow
- schema version and fallback behavior are documented

Quality approval:

- integration review confirms exports are useful starting points, not dead artifacts
- handoff contract is stable enough to support public MVP usage

#### Deliverable 2.6: MVP hardening and release gate

Build:

- browser performance pass
- audio and visual stability pass
- final polish on end-of-run flow and export UX

Validation gate:

- target-browser smoke tests pass
- no major audio instability or Hydra lockups remain in the MVP path
- export succeeds across the main supported path

Quality approval:

- release review confirms the experience feels premium enough for first public exposure
- any unsupported devices or degraded modes are documented clearly

#### Phase 2 exit gate

- v1 scope matches the MVP definition above without quiet scope creep
- the team agrees the first public version is compelling, stable, and remixable
- unresolved issues are low-risk enough to defer into Phase 3

### Phase 3: Expansion

Goal:
expand replay value and ecosystem depth after the MVP loop is proven

#### Deliverable 3.1: Additional chapter or content pack

Build:

- one new chapter or equivalent content pack
- corresponding intent tags, state hooks, and orchestration mappings

Validation gate:

- the new content pack can be added without refactoring core systems
- it produces distinct narrative and AV outcomes

Quality approval:

- content review confirms the pack feels like an expansion, not filler
- authoring workflow remains sustainable for future packs

#### Deliverable 3.2: Alternate ritual mode

Build:

- one alternate ritual structure, rule set, or pacing model
- explicit rules for what systems are reused versus specialized

Validation gate:

- the mode can be selected and completed without breaking the base experience
- differences from the core mode are observable and intentional

Quality approval:

- design review confirms the mode adds genuine breadth rather than cosmetic variance
- complexity cost is acceptable for the retention value it creates

#### Deliverable 3.3: Grimoire or archive

Build:

- a browsable archive of prior runs, relics, or chronicles
- a lightweight metadata model for retrieving prior artifacts

Validation gate:

- prior runs can be listed and reopened or inspected reliably
- archive behavior remains understandable without becoming a full account system

Quality approval:

- product review confirms the archive strengthens afterlife and collection value
- privacy and storage assumptions are documented

#### Deliverable 3.4: Rich export bundles

Build:

- expanded export metadata, annotations, or bundled assets
- clearer bridge from run history to remix workflow

Validation gate:

- richer bundles still import cleanly or degrade safely
- bundle contents stay versioned and inspectable

Quality approval:

- integration review confirms the added data improves creative reuse
- export complexity remains supportable

#### Deliverable 3.5: basilisk-av remix tooling improvements

Build:

- targeted enhancements that make Basilisk exports easier to explore inside basilisk-av
- documentation or prompts that explain how to start remixing

Validation gate:

- a reviewer can take a Basilisk export into basilisk-av and perform a first remix quickly
- the improved flow reduces setup friction compared with MVP

Quality approval:

- ecosystem review confirms the handoff now feels like a true creative bridge
- tooling changes do not force Basilisk to become an AV workstation

#### Phase 3 exit gate

- expansions strengthen retention and creative afterlife without diluting the core ritual
- the team agrees the product is still operating inside its curated scope boundaries

## Success metrics

### Product success

- players finish a run
- players replay to see alternate outputs
- players export artifacts
- players open outputs in basilisk-av
- outputs feel distinct and worth keeping

### Experience success

- players describe the experience as atmospheric and coherent
- story and AV output feel connected to responses
- orchestration feels intentional rather than random
- export feels magical rather than gimmicky
- generated scripts feel remixable

### Technical success

- acceptable performance on target browsers
- no major audio instability
- no frequent Hydra lockups
- deterministic export generation

## Related docs

- [Product foundation](../product/foundation.md)
- [Experience loop](../product/experience-loop.md)
- [Risks and open questions](risks-and-open-questions.md)
