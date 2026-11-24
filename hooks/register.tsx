import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs, ThemeMessageRule } from 'claude-code'

import type { Telemetry } from '../types'
import { makeColors } from './make-colors.js'
import { SCENE } from './scene'

const EMPTY: Telemetry = { turns: 0, tools: 0, lastTool: null, isWorking: false, errors: 0 }
const telemetry = atom({ plugin: 'pearl', key: 'telemetry' } as const, EMPTY, { shape: 'telemetry-1' })
const persona = atom({ plugin: 'pearl', key: 'persona' } as const, true)
const isHidden = atom({ plugin: 'pearl', key: 'isHidden' } as const, false)

const LAVENDER = '#b9a3d6' as const

// Pearl white by day, black pearl by night.
const { theme, problems } = makeColors({
  label: 'Pearl',
  roles: { accent: '#8a6fb5', danger: '#c2414f', success: '#3f9a7a', warning: '#b8862e', pro: '#b0628e' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f3efec',
        'surface-1': '#f7f4f2',
        'surface-2': '#fbf9f8',
        'surface-3': '#fbf9f8',
        'text-primary': '#2b2630',
        'text-secondary': '#4f4757',
        'text-muted': '#6b6273',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0f0f13',
        'surface-1': '#16161c',
        'surface-2': '#1c1c24',
        'surface-3': '#22222b',
        'text-primary': '#efeaf2',
        'text-secondary': '#c9c1d0',
        'text-muted': '#a39bab',
      },
    },
  },
})

// Glass with no tint takes each mode's own panel color.
const BASE: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'nacre', glass: { blur: 18, opacity: 0.7 } },
}

const soft = { y: 2, blur: 10, color: '#00000014' } as const

const STYLE: ThemeSetArgs['style'] = {
  Heading: { color: 'text-accent', fontWeight: 'semibold', letterSpacing: 0.4 },
  AssistantMessage: {
    backgroundColor: 'surface-1',
    color: 'text-primary',
    borderColor: 'border',
    borderWidth: 1,
    radius: 16,
    padding: 16,
    shadow: soft,
  } satisfies ThemeMessageRule,
  UserMessage: {
    backgroundColor: 'bg-accent',
    color: 'text-primary',
    borderColor: 'border-accent',
    borderWidth: 1,
    radius: 16,
    paddingX: 16,
    paddingY: 10,
    shadow: soft,
  },
  ToolUse: { fontFamily: ['mono'], color: 'text-secondary', backgroundColor: 'surface-2', borderColor: 'border', borderWidth: 1, radius: 10, paddingX: 8 },
}

// Quiet tide and glass-bell cues.
const SOUND: ThemeSetArgs['sound'] = {
  ambience: {
    layers: [
      { wave: 'pink', drone: true, gain: 0.1, filter: { type: 'lowpass', hz: 500, to: 900 }, tremolo: { hz: 0.08, depth: 0.5 } },
      { wave: 'sine', notes: ['D3', 'A3'], drone: true, gain: 0.04 },
    ],
    reverb: 0.4,
  },
  cues: {
    send: { layers: [{ wave: 'bell', notes: ['A5'], gain: 0.2, release: 0.5 }] },
    tool: { layers: [{ wave: 'sine', notes: ['E6'], gain: 0.06, release: 0.08 }] },
    done: { layers: [{ wave: 'bell', notes: ['D5', 'F#5', 'A5'], step: 0.09, gain: 0.22, release: 0.8 }], reverb: 0.3 },
    ask: { layers: [{ wave: 'bell', notes: ['B5', 'B5'], step: 0.18, gain: 0.2, release: 0.3 }] },
    error: { layers: [{ wave: 'triangle', notes: ['F4', 'D4'], step: 0.14, gain: 0.14, release: 0.3 }] },
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
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'nacre') return next(e)
    const { Svg } = $.ui.resolve(e)
    return <Svg source={SCENE} alt="Soft nacre light drifting over a pearl ground, with a pearl and slow ripple rings in the corners" />
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) return next(e)
    const t = await read($, telemetry)
    const p = await read($, persona)
    const { Box, Text } = $.ui.resolve(e)
    const state = t.isWorking ? 'PROCESSING' : 'STANDING BY'
    return (
      <Box>
        <Text color={LAVENDER} bold>◦ PEARL </Text>
        <Text color={t.isWorking ? '#ffb43d' : '#3ee08f'}>▸ {state} </Text>
        <Text dimColor>
          · TURNS {t.turns} · OPS {t.tools}{t.lastTool ? ` · LAST ${t.lastTool.toUpperCase()}` : ''}
          {t.errors > 0 ? ` · FAULTS ${t.errors}` : ''} · PERSONA {p ? 'ON' : 'OFF'}
        </Text>
      </Box>
    )
  })
}
