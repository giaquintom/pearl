export type Telemetry = {
  turns: number
  tools: number
  lastTool: string | null
  isWorking: boolean
  errors: number
}

declare module 'claude-code' {
  interface PluginState {
    'pearl': { telemetry: Shaped<Telemetry>; persona: boolean; isHidden: boolean }
  }
}
