This an exploration of an idea I've had for a while. While we've found that the built-in React hooks (`useState`, `useReducer`) are more than complete enough to replace a state management solution like `redux`, there is more to the picture.

`redux` is used as an event bus as often as it is used for state management. Libraries like `redux-observable` and `redux-sagas` are examples of this pattern in the wild. For me, this is valuable functionality and is missing in our out-of-the-box React setup.

So this is my attempt to bring it back! This is a set of hooks that can create an event bus (via observables) that is stored in context and can be subscribed to and emitted to from throughout the React application tree.

# Setup

First, define the types of the events that will be sent along the bus.

```ts
export type MouseClicked = { type: 'mouseClicked' }
export type SpacePressed = { type: 'spacePressed' }
export type MouseMoved = { type: 'mouseMoved'; location: [number, number] }

export type Events = MouseClicked | SpacePressed | MouseMoved
```

Second, create the bus itself.

```ts
export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()
```

Then finally, add the `Provider` to your app.

```tsx
const App = () => {
  return (
    <EventStreamContext.Provider value={stream}>
      {/* my phenomenal app goes here */}
    </EventStreamContext.Provider>
  )
}
```

# Subscribing

```tsx
export const ClickTracker = () => {
  const [clicks, setClicks] = useState(0)

  useStreamCallback(
    EventStreamContext,
    s =>
      s
        .pipe(
          filter(x => x.type === 'mouseClicked'),
        )
        .subscribe(_ => {
          setClicks(clicks + 1)
        }),
    [clicks, setClicks]
  )

  return <div>Clicked: {clicks} times</div>
}

```

# Emitting

```tsx
export const ClickEmitter = () => {
  const emit = useEmit(EventStreamContext)
  const onClick = () => emit({ type: 'mouseClicked' })

  return <button onClick={onClick}>Click Me!</button>
}

```
