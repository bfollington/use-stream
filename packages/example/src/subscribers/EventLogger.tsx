import { useStreamCallback } from '@twopm/use-stream'
import React, { useState } from 'react'
import { filter } from 'rxjs/operators'
import { Events, EventStreamContext } from './events'

export const EventLogger = () => {
  const [events, setEvents] = useState<Events[]>([])
  const [eventCount, setEventCount] = useState(0)

  useStreamCallback(
    EventStreamContext,
    s =>
      s
        .pipe(filter(x => x.type !== 'mouseMoved'))
        .subscribe(ev => setEvents([...events, ev])),
    [events, setEvents]
  )

  useStreamCallback(
    EventStreamContext,
    s => s.subscribe(_ => setEventCount(eventCount + 1)),
    [eventCount, setEventCount]
  )

  return (
    <div>
      <small>
        <label>{eventCount} events handled</label>
      </small>
      <ul>
        {events.map(ev => (
          <li>{ev.type}</li>
        ))}
      </ul>
    </div>
  )
}
