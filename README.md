<h1 align="center">use-stream</h1>

<p align="center">
  <a href="https://github.com/bfollington/use-stream/actions?query=workflow%3A%22Build%22"><img alt="Build" src="https://github.com/bfollington/restack/workflows/Build/badge.svg"></a>
<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/bfollington/use-stream">
<img alt="GitHub" src="https://img.shields.io/github/license/bfollington/use-stream">

<br>
  <img alt="npm" src="https://img.shields.io/npm/v/@twopm/use-stream">
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/@twopm/use-stream">

</p><br>

This an exploration of an idea I've had for a while. While we've found that the built-in React hooks (`useState`, `useReducer`) are more than complete enough to replace a state management solution like `redux`, there is more to the picture.

`redux` is used as an event bus as often as it is used for state management. Libraries like `redux-observable` and `redux-sagas` are examples of this pattern in the wild. For me, this is valuable functionality and is missing in our out-of-the-box React setup.

So this is my attempt to bring it back! This is a set of hooks that can create an event bus (via observables) that is stored in context. The event bus can be *subscribed to* and *emitted to* throughout the React application tree. Importantly, this is a separate stream to the actions that update our state which allows for better separation of concerns.

# Installation

```
yarn add @twopm/use-stream
```

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
import { makeEventStream, makeEventStreamContext } from '@twopm/use-stream'

export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()
```

Then finally, add the `Provider` to your app.

```tsx
import { EventStreamContext } from './streamConfig'

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
import { useStreamCallback } from '@twopm/use-stream'
import { EventStreamContext } from './streamConfig'
import { filter } from 'rxjs/operators'

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
import { useEmit } from '@twopm/use-stream'
import { EventStreamContext } from './streamConfig'

export const ClickEmitter = () => {
  const emit = useEmit(EventStreamContext)
  const onClick = () => emit({ type: 'mouseClicked' })

  return <button onClick={onClick}>Click Me!</button>
}

```

## Running this repo

### Bootstrap

```
yarn
yarn bootstrap
```

### Running the examples

```
cd packages/use-stream
yarn build
cd ../example
yarn start
```
