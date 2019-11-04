import React, { useState } from 'react'
import { useStreamCallback } from '../hooks/useStream'
import { EventStreamContext, MouseMoved } from './events'
import { filter, map } from 'rxjs/operators'

export const CursorTracker = () => {
  const [position, setPosition] = useState([0, 0])

  useStreamCallback(
    EventStreamContext,
    s =>
      s
        .pipe(
          filter(x => x.type === 'mouseMoved'),
          map(x => x as MouseMoved)
        )
        .subscribe(x => setPosition(x.location)),
    [setPosition]
  )

  return (
    <div
      style={{
        position: 'absolute',
        top: position[1] + 'px',
        left: position[0] + 'px',
        width: '32px',
        height: '32px',
        background: 'red',
      }}
    ></div>
  )
}
