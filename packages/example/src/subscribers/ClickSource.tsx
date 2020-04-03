import React, { useEffect, useState } from 'react'
import { filter, tap } from 'rxjs/operators'
import { useEmit, useSubscribe } from './events'

export const ClickSource = () => {
  const [clicks, setClicks] = useState(0)
  const emit = useEmit()
  const onClick = () => emit({ type: 'mouseClicked' })

  useSubscribe(
    s =>
      s
        .pipe(
          filter(x => x.type === 'mouseClicked'),
          tap(console.log)
        )
        .subscribe(_ => {
          setClicks(clicks + 1)
        }),
    [clicks, setClicks]
  )

  useEffect(() => {
    const cb = (ev: MouseEvent) => {
      emit({ type: 'mouseMoved', location: [ev.clientX, ev.clientY] })
    }
    window.addEventListener('mousemove', cb)

    return () => window.removeEventListener('mousemove', cb)
  }, [emit])

  return <div onClick={onClick}>Clicked: {clicks} times</div>
}
