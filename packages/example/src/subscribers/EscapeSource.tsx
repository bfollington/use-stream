import React, { useEffect, useState } from 'react'
import { filter, tap } from 'rxjs/operators'
import { useEmit, useSubscribe } from './events'

export const EscapeSource = () => {
  const [presses, setPresses] = useState(0)
  const emit = useEmit()

  useSubscribe(
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
