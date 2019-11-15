import React, { useEffect, useState } from 'react'
import { filter, tap } from 'rxjs/operators'
import { EventStreamContext } from './events'
import { useEmit, useStreamCallback } from '@twopm/use-stream'

export const EscapeSource = () => {
  const [presses, setPresses] = useState(0)
  const emit = useEmit(EventStreamContext)

  useStreamCallback(
    EventStreamContext,
    s =>
      s
        .pipe(
          filter(x => x.type === 'spacePressed'),
          tap(console.log)
        )
        .subscribe(_ => {
          setPresses(presses + 1)
        }),
    [presses, setPresses]
  )

  useEffect(() => {
    const cb = (ev: KeyboardEvent) => {
      if (ev.keyCode === 32) {
        emit({ type: 'spacePressed' })
      }
    }
    window.addEventListener('keypress', cb)

    return () => window.removeEventListener('keypress', cb)
  }, [emit])

  return <div>Pressed: {presses} times</div>
}
