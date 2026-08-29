import './App.css'

function App() {
  return (
    <main className="popup">
      <header className="popup-header">
        <h1>🎙 Realtime Subtitles</h1>
        <span className="status">● Ready</span>
      </header>

      <section className="settings">
        <label htmlFor="subtitle-language">
          Subtitle Language
        </label>

        <select id="subtitle-language">
          <option value="si">Sinhala</option>
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
          <option value="de">German</option>
          <option value="fr">French</option>
        </select>
      </section>

      <button type="button">
        Start Subtitles
      </button>
    </main>
  )
}

export default App
