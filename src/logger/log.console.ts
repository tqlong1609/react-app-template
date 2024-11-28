import pino, { Logger } from 'pino'
import pretty from 'pino-pretty'
import 'server-only'

const stream = pretty({
  colorize: true,
}) as any

export const loggerConsole = pino(stream)
