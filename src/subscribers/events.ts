import { makeEventStream, makeEventStreamContext } from '../hooks/useStream'

export type MouseClicked = { type: 'mouseClicked' }
export type SpacePressed = { type: 'spacePressed' }
export type MouseMoved = { type: 'mouseMoved'; location: [number, number] }

export type Events = MouseClicked | SpacePressed | MouseMoved

export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()
