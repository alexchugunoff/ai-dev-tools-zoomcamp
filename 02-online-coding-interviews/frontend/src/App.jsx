import React, { useEffect, useState, useRef } from 'react'
import CodeEditor from './components/CodeEditor'

function App() {
  const [sessionId, setSessionId] = useState(null)
  const [code, setCode] = useState('// choose language and start coding')
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const wsRef = useRef(null)
  const pyodideRef = useRef(null)
  const pyodideReadyRef = useRef(false)

  useEffect(() => {
    if (!sessionId) return
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.hostname
    const port = window.location.port ? ':' + window.location.port : ''
    const wsUrl = `${protocol}//${host}${port}/ws?sessionId=${sessionId}`
    console.log('Connecting to WebSocket:', wsUrl)
    const ws = new WebSocket(wsUrl)
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

  useEffect(() => {
    const initPyodide = async () => {
      try {
        if (typeof window.loadPyodide !== 'undefined') {
          const pyodide = await window.loadPyodide()
          pyodideRef.current = pyodide
          pyodideReadyRef.current = true
        }
      } catch (e) {
        console.error('Failed to load Pyodide:', e)
      }
    }
    initPyodide()
  }, [])

  const createSession = async () => {
    // Creates a new interview session with a unique ID
    // This ID is used to create a shareable link that candidates can join
    // Everyone with the same sessionId will see real-time code edits
    try {
      console.log('Creating session...')
      const res = await fetch('/api/sessions', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('Response status:', res.status)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      const data = await res.json()
      console.log('Session created:', data)
      setSessionId(data.id)
      alert(`Session created! ID: ${data.id}`)
    } catch (e) {
      console.error('Create session error:', e)
      alert(`Error creating session: ${e.message}`)
    }
  }

  const sendPatch = (newCode) => {
    setCode(newCode)
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'patch', code: newCode }))
    }
  }

  const runInSandbox = async (src) => {
    setIsRunning(true)
    setOutput('')
    const previewDiv = document.getElementById('preview')
    previewDiv.innerHTML = '<div style="color:gray;">Running...</div>'

    try {
      if (language === 'python') {
        if (!pyodideReadyRef.current || !pyodideRef.current) {
          setOutput('Error: Pyodide not loaded')
          previewDiv.innerHTML = '<div style="color:red;">Error: Pyodide not loaded</div>'
          setIsRunning(false)
          return
        }

        const pyodide = pyodideRef.current
        // Capture print output
        const oldLog = console.log
        const logs = []
        window.console.log = (...args) => {
          logs.push(args.join(' '))
          oldLog(...args)
        }

        try {
          const result = await pyodide.runPythonAsync(src)
          window.console.log = oldLog
          const output = logs.join('\n') + (result ? '\n' + result : '')
          setOutput(output)
          previewDiv.innerHTML = `<pre>${escapeHtml(output)}</pre>`
        } catch (e) {
          window.console.log = oldLog
          setOutput(`Error: ${e.message}`)
          previewDiv.innerHTML = `<div style="color:red;"><pre>${escapeHtml(e.message)}</pre></div>`
        }
      } else {
        // JavaScript execution in iframe sandbox
        const iframe = document.createElement('iframe')
        iframe.sandbox = 'allow-scripts'
        iframe.style.width = '100%'
        iframe.style.height = '200px'
        previewDiv.innerHTML = ''
        previewDiv.appendChild(iframe)

        const logs = []
        const script = `
          <script>
            window.logs = [];
            const originalLog = console.log;
            console.log = function(...args) {
              window.logs.push(args.join(' '));
              originalLog.apply(console, args);
            };
            try {
              ${src}
            } catch(e) {
              console.log('Error:', e.message);
            }
            document.body.innerText = window.logs.join('\\n');
          </script>
        `
        iframe.contentWindow.document.open()
        iframe.contentWindow.document.write(script)
        iframe.contentWindow.document.close()
      }
    } catch (e) {
      setOutput(`Error: ${e.message}`)
      previewDiv.innerHTML = `<div style="color:red;"><pre>${escapeHtml(e.message)}</pre></div>`
    } finally {
      setIsRunning(false)
    }
  }

  const escapeHtml = (text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
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
          <button onClick={() => runInSandbox(code)} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run code'}
          </button>
        </div>
        <div id="preview" />
      </main>
    </div>
  )
}

export default App
