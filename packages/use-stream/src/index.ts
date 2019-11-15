import { createContext, useCallback, useContext, useEffect } from 'react'
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

export const useStream = <T>(ctx: React.Context<EventStream<T>>) =>
  useContext(ctx)
export const useEmit = <T>(ctx: React.Context<EventStream<T>>) =>
  useContext(ctx).emit
export const useSubscribe = <T>(ctx: React.Context<EventStream<T>>) =>
  useContext(ctx).stream

export function useStreamEffect<T>(
  ctx: React.Context<EventStream<T>>,
  observer: (o: Observable<T>) => Subscription
) {
  const stream = useSubscribe(ctx)
  useEffect(() => {
    const s = observer(stream)
    return () => s.unsubscribe()
  }, [observer, stream, ctx])
}

export function useStreamCallback<T>(
  ctx: React.Context<EventStream<T>>,
  cb: (s: Observable<T>) => Subscription,
  deps: readonly any[]
) {
  return useStreamEffect(ctx, useCallback(cb, deps))
}
