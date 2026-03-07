# Roadmap

Use this document when deciding what to build first, where MVP boundaries sit, and how to sequence delivery.

## MVP definition

### v1 includes

- one complete 10-15 minute run
- 8-15 scenes
- 3-5 endings
- hidden ritual state system
- bounded adaptive Hydra visuals
- bounded adaptive Strudel or Tone-style sound system
- end-of-run chronicle
- end-of-run Strudel script
- end-of-run Hydra script
- basilisk-av compatible export payload

### v1 excludes

- full freeform text parser
- giant branching story map
- user-authored in-game code editing
- account system
- cloud save
- native app packaging

## Delivery phases

### Phase 1: Vertical slice

Build:

- one narrative path
- one visual family
- one audio family
- hidden ritual state
- basic export prototype

Goal:
prove the loop works

### Phase 2: MVP

Build:

- complete v1 run
- multiple endings
- multiple AV families
- polished export flow
- basilisk-av import compatibility

Goal:
ship a compelling first public version

### Phase 3: Expansion

Build:

- more chapters
- alternate rituals
- grimoire or archive of prior runs
- richer export bundles
- improved remix tooling inside basilisk-av

Goal:
expand the universe and strengthen retention

## Success metrics

### Product success

- players finish a run
- players replay to see alternate outputs
- players export artifacts
- players open outputs in basilisk-av
- outputs feel distinct and worth keeping

### Experience success

- players describe the experience as atmospheric and coherent
- AV output feels connected to choices
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
