import {
  makeEventStream,
  makeEventStreamContext,
  createHooks,
} from '@twopm/use-stream'

export type MouseClicked = { type: 'mouseClicked' }
export type SpacePressed = { type: 'spacePressed' }
export type MouseMoved = { type: 'mouseMoved'; location: [number, number] }

export type Events = MouseClicked | SpacePressed | MouseMoved

export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()

const hooks = createHooks(EventStreamContext)
export const useStream = hooks.useStream
export const useSubscribe = hooks.useSubscribe
export const useEmit = hooks.useEmit
