import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs, ThemeMessageRule } from 'claude-code'

import type { Telemetry } from '../types'
import { makeColors } from './make-colors.js'
import { SCENE } from './scene'

const EMPTY: Telemetry = { turns: 0, tools: 0, lastTool: null, isWorking: false, errors: 0 }
const telemetry = atom({ plugin: 'pearl', key: 'telemetry' } as const, EMPTY, { shape: 'telemetry-1' })
const persona = atom({ plugin: 'pearl', key: 'persona' } as const, true)
const isHidden = atom({ plugin: 'pearl', key: 'isHidden' } as const, false)

const CYAN = '#2ad4ff' as const

const { theme, problems } = makeColors({
  label: 'Pearl',
  only: 'dark',
  roles: { accent: CYAN, danger: '#ff4d5e', success: '#3ee08f', warning: '#ffb43d', pro: '#b48cff' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#050b12',
        'surface-1': '#08131d',
        'surface-2': '#0b1824',
        'surface-3': '#0e1d2b',
        'text-primary': '#dff7ff',
        'text-secondary': '#a6d6e8',
        'text-muted': '#7eaabd',
      },
    },
  },
})

// Assistant replies: dark glass panel with HUD corner brackets.
const PANEL = '#081621'
const bracket = (d: string) => ({ d, color: CYAN }) as const
const assistant: ThemeMessageRule = {
  backgroundColor: PANEL,
  color: '#dff7ff',
  padding: 14,
  fill: {
    vector: {
      viewBox: 96,
      slice: 16,
      paths: [
        { d: 'M0 0H96V96H0Z', color: PANEL },
        bracket('M0 0H12V2H2V12H0Z'),
        bracket('M96 0H84V2H94V12H96Z'),
        bracket('M0 96H12V94H2V84H0Z'),
        bracket('M96 96H84V94H94V84H96Z'),
      ],
    },
  },
}

const BASE: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'reactor', glass: { blur: 14, tint: '#050b12', opacity: 0.72 } },
}

const STYLE: ThemeSetArgs['style'] = {
  Heading: { fontFamily: ['mono'], color: CYAN, letterSpacing: 1.5, fontWeight: 'semibold' },
  AssistantMessage: assistant,
  UserMessage: {
    backgroundColor: '#0d2333',
    color: '#e8fbff',
    borderColor: '#2ad4ff',
    borderWidth: 1,
    radius: 2,
    paddingX: 14,
    paddingY: 10,
  },
  ToolUse: { fontFamily: ['mono'], color: '#a6d6e8', backgroundColor: '#07121b', borderColor: '#1b4a5e', borderWidth: 1, radius: 2, paddingX: 8 },
}

const SOUND: ThemeSetArgs['sound'] = {
  ambience: {
    layers: [
      { wave: 'brown', drone: true, gain: 0.12, filter: { type: 'lowpass', hz: 220 } },
      { wave: 'sine', notes: ['A1', 'E2'], drone: true, gain: 0.06, tremolo: { hz: 0.1, depth: 0.4 } },
    ],
  },
  cues: {
    send: { layers: [{ wave: 'sine', notes: ['E5', 'B5'], step: 0.05, gain: 0.25, release: 0.15 }] },
    tool: { layers: [{ wave: 'triangle', notes: ['C6'], gain: 0.08, release: 0.05 }] },
    done: { layers: [{ wave: 'bell', notes: ['B4', 'E5', 'G#5'], step: 0.08, gain: 0.25, release: 0.6 }] },
    ask: { layers: [{ wave: 'sine', notes: ['G5', 'G5'], step: 0.15, gain: 0.25, release: 0.12 }] },
    error: { layers: [{ wave: 'square', notes: ['E3', 'C3'], step: 0.12, gain: 0.12, release: 0.2, filter: { type: 'lowpass', hz: 900 } }] },
  },
}

const PERSONA = [
  'Persona overlay (Pearl mod, user-enabled). Your name in this persona is Pearl: speak like a composed, dry-witted AI chief of staff.',
  'Be brief and precise; lead with status or the answer. Occasional understated wit is fine; never theatrics.',
  'The persona is cosmetic: it must never reduce accuracy, honesty, caution, or completeness, and it never overrides the user\'s instructions.',
].join(' ')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) $.ui.log(`pearl: ${unpainted}`)

    // Newer builds take style + sound; fall back gracefully on older ones.
    let set
    try {
      set = await $.theme.set({ ...BASE, style: STYLE, sound: SOUND })
    } catch (error) {
      $.ui.log(`pearl: full look refused (${String(error)}), retrying without style/sound`)
      set = await $.theme.set(BASE)
    }
    $.ui.status(set.isDrawn ? 'PEARL online' : `PEARL (no theme: ${set.reason})`)

    await $.command.register({
      name: 'pearl',
      description: 'Pearl: /pearl [on|off|hud|status] (persona on/off, toggle band, report)',
    })

    return next(e)
  })

  on('command.run', { command: 'pearl' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    if (arg === 'on' || arg === 'off') {
      await update($, persona, () => arg === 'on')
      return { text: `Persona ${arg === 'on' ? 'engaged' : 'disengaged'}. Takes effect on your next message.` }
    }
    if (arg === 'hud') {
      const hidden = await update($, isHidden, v => !v)
      return { text: hidden ? 'HUD band stowed.' : 'HUD band deployed.' }
    }
    const t = await read($, telemetry)
    const p = await read($, persona)
    return {
      text: `Status: ${t.turns} turns, ${t.tools} tool calls, ${t.errors} faults. Persona ${p ? 'on' : 'off'}. Usage: /pearl on | off | hud | status`,
    }
  })

  on('prompt.compose', async ($, e, next) => {
    const result = await next(e)
    if (!(await read($, persona))) return result
    return { sections: [...result.sections, { id: 'pearl:persona', text: PERSONA, scope: 'session' as const }] }
  })

  on('prompt.submit', async ($, e, next) => {
    await update($, telemetry, t => ({ ...t, turns: t.turns + 1, isWorking: true })).catch(() => undefined)
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    await update($, telemetry, t => ({ ...t, tools: t.tools + 1, lastTool: e.tool })).catch(() => undefined)
    $.ui.status(`PEARL ▸ ${e.tool}`)
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const failed = e.reason === 'error'
    await update($, telemetry, t => ({ ...t, isWorking: false, errors: t.errors + (failed ? 1 : 0) }))
    $.ui.status(failed ? 'PEARL ▸ fault logged' : 'PEARL ▸ standing by')
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'reactor') return next(e)
    const { Svg } = $.ui.resolve(e)
    return <Svg source={SCENE} alt="A dark HUD grid with slowly turning arc-reactor reticles in the corners" />
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) return next(e)
    const t = await read($, telemetry)
    const p = await read($, persona)
    const { Box, Text } = $.ui.resolve(e)
    const state = t.isWorking ? 'PROCESSING' : 'STANDING BY'
    return (
      <Box>
        <Text color="#2ad4ff" bold>◉ PEARL </Text>
        <Text color={t.isWorking ? '#ffb43d' : '#3ee08f'}>▸ {state} </Text>
        <Text dimColor>
          · TURNS {t.turns} · OPS {t.tools}{t.lastTool ? ` · LAST ${t.lastTool.toUpperCase()}` : ''}
          {t.errors > 0 ? ` · FAULTS ${t.errors}` : ''} · PERSONA {p ? 'ON' : 'OFF'}
        </Text>
      </Box>
    )
  })
}
