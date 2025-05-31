import { useEffect, useState } from "react"
const times = {
  work: 0.1,
  shortBreak: 0.2,
  longBreak: 0.3,
}
const App = () => {
  const [settings, setSettings] = useState({
    times,
  })
  const [type, setType] = useState("work")
  const [time, setTime] = useState(settings.times[type] * 60)
  const [paused, setPaused] = useState(true)
  const [sessions, setSessions] = useState(0)
  useEffect(() => {
    const intervalID = setInterval(() => {
      if (paused) return
      setTime(prev => {
        if (prev < 0) return prev
        if (prev === 0) {
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
  const changeSettings = newSettings => {
    setSettings(newSettings)
    if (paused) {
      setTime(newSettings.times[type] * 60)
    }
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
      <Settings setSettings={changeSettings} settings={settings} />
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
const Settings = ({ settings, setSettings }) => {
  const [formSettings, setFormSettings] = useState({
    ...settings,
  })
  const saveSettings = e => {
    e.preventDefault()
    setSettings(formSettings)
  }
  const setTime = (property, value) => {
    const temp = {
      ...formSettings,
    }
    temp.times[property] = value
    setFormSettings(temp)
  }
  return (
    <div>
      <button>Settings</button>
      <form onSubmit={saveSettings}>
        <label>
          Work:
          <input
            type="text"
            value={formSettings.times.work}
            onChange={e => setTime("work", e.target.value)}
          />
        </label>
        <label>
          Short Break:
          <input
            type="text"
            value={formSettings.times.shortBreak}
            onChange={e => setTime("shortBreak", e.target.value)}
          />
        </label>
        <label>
          Long Break:
          <input
            type="text"
            value={formSettings.times.longBreak}
            onChange={e => setTime("longBreak", e.target.value)}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default App
