import { createContext, useContext, useEffect, DependencyList } from 'react'
import { from, Observable, Subject, Subscription } from 'rxjs'

export type EventStream<T> = {
  name: string
  emit: (e: T) => void
  close: () => void
  stream: Observable<T>
}

const zero = <T>(): EventStream<T> => ({
  name: 'null',
  emit: () => {},
  close: () => {},
  stream: from([]),
})

export const makeEventStream = <T>(name: string): EventStream<T> => {
  const subject = new Subject<T>()

  return {
    name,
    stream: subject.asObservable(),
    emit: (e: T) => subject.next(e),
    close: () => subject.complete(),
  }
}

export const makeEventStreamContext = <T>() => createContext(zero<T>())

export const useStream = <T>(ctx: React.Context<EventStream<T>>) => useContext(ctx)

export function createHooks<T>(ctx: React.Context<EventStream<T>>) {
  return {
    useStream: () => useContext(ctx),
    useEmit: () => useContext(ctx).emit,
    useSubscribe: function(s$: (o: Observable<T>) => Subscription, deps?: DependencyList): void {
      return useEffect(() => {
        const sub = s$(useContext(ctx).stream)
        return sub.unsubscribe()
      }, deps)
    },
  }
}
