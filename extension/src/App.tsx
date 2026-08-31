import { useState, useEffect } from 'react'
import './App.css'
import { startSubtitles, stopSubtitles } from './services/extension-messaging'

const WAVEFORM_BARS = 7

function App() {
  const [isCapturing, setIsCapturing] = useState<boolean>(false)
  const [language, setLanguage] = useState<string>('si')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      chrome.storage.session.get(['isCapturing', 'language'], (result) => {
        if (result.isCapturing !== undefined) {
          setIsCapturing(Boolean(result.isCapturing))
        }
        if (typeof result.language === 'string') {
          setLanguage(result.language)
        }
      })

      const handleStorageChange = (
        changes: { [key: string]: chrome.storage.StorageChange },
        areaName: string
      ) => {
        if (areaName === 'session') {
          if (changes.isCapturing) {
            setIsCapturing(Boolean(changes.isCapturing.newValue))
          }
          if (changes.language && typeof changes.language.newValue === 'string') {
            setLanguage(changes.language.newValue)
          }
        }
      }

      chrome.storage.onChanged.addListener(handleStorageChange)
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange)
      }
    }
  }, [])

  const handleToggleSubtitles = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (isCapturing) {
        const response = await stopSubtitles()
        if (response?.success) {
          setIsCapturing(false)
        } else {
          setError(response?.error || 'Failed to stop subtitles')
        }
      } else {
        const response = await startSubtitles(language)
        if (response?.success) {
          setIsCapturing(true)
        } else {
          setError(response?.error || 'Failed to start subtitles')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const buttonLabel = isLoading
    ? isCapturing ? 'Stopping…' : 'Starting…'
    : isCapturing ? 'Stop Subtitles' : 'Start Subtitles'

  return (
    <main className="popup">
      <header className="popup-header">
        <div className="header-left">
          <span className={`mic-icon ${isCapturing ? 'capturing' : ''}`} aria-hidden="true">
            🎙
          </span>
          <h1>Realtime Subtitles</h1>
        </div>

        <div className={`status-badge ${isCapturing ? 'active' : 'idle'}`} role="status" aria-live="polite">
          <span className="status-dot" />
          {isCapturing ? 'Live' : 'Ready'}
        </div>
      </header>

      <div className="popup-body">

        <div className={`waveform-container ${isCapturing ? 'active' : ''}`} aria-hidden="true">
          {Array.from({ length: WAVEFORM_BARS }).map((_, i) => (
            <div key={i} className="waveform-bar" />
          ))}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="subtitle-language">
            Subtitle Language
          </label>
          <div className="select-wrapper">
            <select
              id="subtitle-language"
              className="lang-select"
              value={language}
              disabled={isCapturing || isLoading}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="si">🇱🇰 Sinhala</option>
              <option value="en">🇺🇸 English</option>
              <option value="ta">🇮🇳 Tamil</option>
              <option value="zh">🇨🇳 Chinese</option>
              <option value="ja">🇯🇵 Japanese</option>
              <option value="de">🇩🇪 German</option>
              <option value="fr">🇫🇷 French</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="error-msg" role="alert">
            ⚠ {error}
          </p>
        )}

        <button
          type="button"
          id="toggle-subtitles-btn"
          className={`toggle-btn ${isCapturing ? 'stop' : 'start'}`}
          disabled={isLoading}
          onClick={handleToggleSubtitles}
          aria-pressed={isCapturing}
        >
          {buttonLabel}
        </button>
      </div>

      <footer className="popup-footer">
        Realtime Subtitles v0.1.0
      </footer>
    </main>
  )
}

export default App
