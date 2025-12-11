import React, { useEffect, useState, useRef } from 'react'
import CodeEditor from './components/CodeEditor'

function App() {
  const [sessionId, setSessionId] = useState(null)
  const [code, setCode] = useState('// choose language and start coding')
  const [language, setLanguage] = useState('javascript')
  const wsRef = useRef(null)

  useEffect(() => {
    if (!sessionId) return
    const ws = new WebSocket(`ws://localhost:3000/ws?sessionId=${sessionId}`)
    wsRef.current = ws
    ws.addEventListener('message', (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'init' || msg.type === 'update') {
          setCode(msg.code)
        }
      } catch (e) {}
    })
    return () => ws.close()
  }, [sessionId])

  const createSession = async () => {
    const res = await fetch('/api/sessions', { method: 'POST' })
    const data = await res.json()
    setSessionId(data.id)
  }

  const sendPatch = (newCode) => {
    setCode(newCode)
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'patch', code: newCode }))
    }
  }

  const runInSandbox = (src) => {
    const iframe = document.createElement('iframe')
    iframe.sandbox = 'allow-scripts'
    iframe.style.width = '100%'
    iframe.style.height = '200px'
    document.getElementById('preview').innerHTML = ''
    document.getElementById('preview').appendChild(iframe)
    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(`<script>try{${src}}catch(e){document.body.innerText=e}</script>`)
    iframe.contentWindow.document.close()
  }

  return (
    <div className="container">
      <header>
        <h1>Online Coding Interviews</h1>
        {!sessionId && <button onClick={createSession}>Create session</button>}
        {sessionId && <div>Session: {sessionId}</div>}
      </header>
      <main>
        <div className="controls">
          <label>Language: </label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>
        <CodeEditor code={code} onChange={sendPatch} language={language} />
        <div className="controls">
          <button onClick={() => runInSandbox(code)}>Run (sandboxed)</button>
        </div>
        <div id="preview" />
      </main>
    </div>
  )
}

export default App
