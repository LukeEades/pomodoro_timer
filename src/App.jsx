import { useEffect, useState } from "react"
const times = {
  work: 0.1,
  shortBreak: 0.2,
  longBreak: 0.3,
}
const App = () => {
  const [type, setType] = useState("work")
  const [time, setTime] = useState(times[type] * 60)
  const [paused, setPaused] = useState(true)
  const [sessions, setSessions] = useState(0)
  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(prev => {
        if (paused || prev < 0) return prev
        if (prev === 0) {
          // set to next type and reset timer
          timerEnd()
          return times[type] * 60
        } else if (prev > 0) return prev - 1
      })
    }, 1000)
    return () => {
      clearInterval(intervalID)
    }
  }, [paused, type])
  const timerEnd = () => {
    let nextType
    if (type === "work") {
      if (sessions < 3) {
        setSessions(sessions + 1)
        nextType = "shortBreak"
      } else {
        setSessions(0)
        nextType = "longBreak"
      }
    } else {
      nextType = "work"
    }
    setTo(nextType)
    // needs to make a sound
  }
  const setTo = timerType => {
    setType(timerType)
    setTime(times[timerType] * 60)
    setPaused(true)
  }
  return (
    <div>
      <nav>
        <button
          onClick={() => {
            setTo("work")
          }}
        >
          Work
        </button>
        <button
          onClick={() => {
            setTo("shortBreak")
          }}
        >
          Short Break
        </button>
        <button
          onClick={() => {
            setTo("longBreak")
          }}
        >
          Long Break
        </button>
      </nav>
      <Timer seconds={time} />
      <nav>
        <button
          onClick={() => {
            setPaused(!paused)
          }}
        >
          {paused ? "Play" : "Pause"}
        </button>
        <button
          onClick={() => {
            setTime(minutes * 60)
          }}
        >
          Reset
        </button>
      </nav>
    </div>
  )
}
const Timer = ({ seconds }) => {
  const padTime = time => {
    return `${time}`.padStart(2, "0")
  }
  return (
    <div>
      {padTime(Math.floor(seconds / 60))}:{padTime(seconds % 60)}
    </div>
  )
}

export default App
