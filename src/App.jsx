import { useEffect, useState } from "react"
import "./stylesheets/timer.css"
import alarmPath from "./assets/alarm.mp3"
const defaultSettings = {
  times: {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  },
}
const alarm = new Audio(alarmPath)
const playAlarm = () => {
  alarm.play()
}
const App = () => {
  const [settings, setSettings] = useState(
    (() => {
      const settings = localStorage.getItem("settings")
      return settings ? JSON.parse(settings) : defaultSettings
    })()
  )
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
          return settings.times[type] * 60
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
    playAlarm()
  }
  const setTo = timerType => {
    setType(timerType)
    setTime(settings.times[timerType] * 60)
    setPaused(true)
  }
  const changeSettings = newSettings => {
    setSettings(newSettings)
    if (paused) {
      setTime(newSettings.times[type] * 60)
    }
    localStorage.setItem("settings", JSON.stringify(newSettings))
  }
  return (
    <div>
      <Settings settings={settings} setSettings={changeSettings} />
      <Timer
        type={type}
        time={time}
        settings={settings}
        paused={paused}
        setPaused={setPaused}
        setTo={setTo}
      />
    </div>
  )
}
const Timer = ({ type, settings, time, paused, setPaused, setTo }) => {
  return (
    <div className="timer">
      <nav className="timer-type">
        <button
          onClick={() => {
            setTo("work")
          }}
          className={type === "work" ? "selected" : undefined}
        >
          Work
        </button>
        <button
          onClick={() => {
            setTo("shortBreak")
          }}
          className={type === "shortBreak" ? "selected" : undefined}
        >
          Short Break
        </button>
        <button
          onClick={() => {
            setTo("longBreak")
          }}
          className={type === "longBreak" ? "selected" : undefined}
        >
          Long Break
        </button>
      </nav>
      <Time seconds={time} />
      <nav className="timer-controls">
        <button
          onClick={() => {
            setPaused(!paused)
          }}
        >
          {paused ? "Play" : "Pause"}
        </button>
        <button
          onClick={() => {
            setTo(type)
          }}
        >
          Reset
        </button>
      </nav>
    </div>
  )
}
const Time = ({ seconds }) => {
  const padTime = time => {
    return `${time}`.padStart(2, "0")
  }
  return (
    <span className="time">
      {padTime(Math.floor(seconds / 60))}:{padTime(seconds % 60)}
    </span>
  )
}
const Settings = ({ settings, setSettings }) => {
  const [shown, setShown] = useState(false)
  const handleEscape = e => {
    if (e.code === "Escape" && shown) {
      setShown(!shown)
    }
  }
  useEffect(() => {
    addEventListener("keydown", handleEscape)
    return () => {
      removeEventListener("keydown", handleEscape)
    }
  }, [shown])
  const setTime = (property, value) => {
    const temp = {
      ...settings,
    }
    temp.times[property] = value
    setSettings(temp)
  }
  const toggleSettings = () => {
    setShown(!shown)
  }
  return (
    <div id="settings" className={shown ? "shown" : undefined}>
      <button onClick={toggleSettings}>{shown ? "Close" : "Settings"}</button>
      <div className="values">
        <label>
          <span>Work:</span>
          <input
            min={1}
            type="number"
            value={settings.times.work}
            onChange={e => setTime("work", e.target.value)}
          />
        </label>
        <label>
          Short Break:
          <input
            min={1}
            type="number"
            value={settings.times.shortBreak}
            onChange={e => setTime("shortBreak", e.target.value)}
          />
        </label>
        <label>
          Long Break:
          <input
            min={1}
            type="number"
            value={settings.times.longBreak}
            onChange={e => setTime("longBreak", e.target.value)}
          />
        </label>
      </div>
    </div>
  )
}

export default App
