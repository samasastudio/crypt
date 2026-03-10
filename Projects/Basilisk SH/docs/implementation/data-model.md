# Data Model

Use this document when defining canonical types, serialized payloads, and the contracts between narrative, runtime, and export systems.

## Core run model

```ts
type BasiliskRun = {
  id: string
  seed: string
  startedAt: string
  endedAt?: string
  version: string
  responseMode: 'choice' | 'text' | 'hybrid'
  scenesVisited: SceneVisit[]
  responses: ResponseRecord[]
  choicesMade: ChoiceRecord[]
  ritualStateHistory: RitualStateSnapshot[]
  orchestrationHistory: OrchestrationDecision[]
  audioScore: AudioScore
  visualScore: VisualScore
  ending: EndingResult
  tags: string[]
}
```

## Narrative scene model

```ts
type Scene = {
  id: string
  title: string
  body: string[]
  choices: Choice[]
  responseMode?: 'choice' | 'text' | 'hybrid'
  entryEffects?: RitualStateDelta[]
  exitEffects?: RitualStateDelta[]
  audioCue?: AudioCueRef
  visualCue?: VisualCueRef
  orchestrationTags?: string[]
  conditions?: SceneCondition[]
  nextSceneResolver?: string
}
```

## Choice model

```ts
type Choice = {
  id: string
  label: string
  description?: string
  effects: RitualStateDelta[]
  tags?: string[]
  intentTags?: string[]
  nextSceneId?: string
  conditions?: SceneCondition[]
}
```

## Response and orchestration models

```ts
type ResponseRecord = {
  id: string
  sceneId: string
  mode: 'choice' | 'text' | 'hybrid'
  rawText?: string
  selectedChoiceIds?: string[]
  inferredIntentTags: string[]
}

type OrchestrationDecision = {
  sceneId: string
  selectedSegmentId: string
  selectedAudioFamily: string
  selectedVisualFamily: string
  motifTags: string[]
  pacingBand: 'low' | 'medium' | 'high'
  rationaleTags: string[]
}
```

## Ritual state model

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

## Audio score model

```ts
type AudioScore = {
  tempo: number
  root: string
  mode: 'aeolian' | 'dorian' | 'phrygian' | 'locrian'
  density: number
  textureProfile: string[]
  pulseProfile: string[]
  motifTokens: string[]
  orchestrationFamilies: string[]
  sceneCues: AudioSceneCue[]
  tensionCurve: number[]
  assetPalette: string[]
}
```

## Visual score model

```ts
type VisualScore = {
  family: string
  palette: string[]
  motion: number
  contrast: number
  feedback: number
  familyHistory: string[]
  geometryTags: string[]
  sceneCues: VisualSceneCue[]
}
```

## Export payload

```ts
type BasiliskExport = {
  run: BasiliskRun
  chronicle: string
  strudelCode: string
  hydraCode: string
  basiliskAvPreset: BasiliskAvPreset
}
```

## Modeling notes

- `BasiliskRun` should be the canonical serialized record of a completed session.
- `RitualState` should stay compact and legible so writers and engineers can reason about its effects.
- `ResponseRecord` and `OrchestrationDecision` should preserve how the run was interpreted and arranged, not just what state totals came out of it.
- `AudioScore` and `VisualScore` should represent authored output intent rather than low-level runtime implementation state.
- Export models should be versioned early to keep basilisk-av compatibility manageable over time.

## Related docs

- [Architecture](architecture.md)
- [Export and integration](../systems/export-and-integration.md)
- [Risks and open questions](../planning/risks-and-open-questions.md)
