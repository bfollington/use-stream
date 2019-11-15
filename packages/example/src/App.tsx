import React from 'react'
import './App.css'
import { ClickSource } from './subscribers/ClickSource'
import { CursorTracker } from './subscribers/CursorTracker'
import { EscapeSource } from './subscribers/EscapeSource'
import { EventLogger } from './subscribers/EventLogger'
import { EventStreamContext, stream } from './subscribers/events'

const App = () => {
  return (
    <EventStreamContext.Provider value={stream}>
      <div className="App">
        <header className="App-header">
          <EscapeSource />
          <ClickSource />
          <CursorTracker />
          <EventLogger />
        </header>
      </div>
    </EventStreamContext.Provider>
  )
}

export default App
