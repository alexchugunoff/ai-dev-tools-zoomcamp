const express = require('express')
const { WebSocketServer } = require('ws')
const http = require('http')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(express.json())
app.use(cors())

const sessions = new Map()

app.post('/api/sessions', (req, res) => {
  const id = uuidv4()
  const session = { id, code: '// start coding', lang: 'javascript' }
  sessions.set(id, session)
  res.json({ id })
})

app.get('/api/sessions/:id', (req, res) => {
  const s = sessions.get(req.params.id)
  if (!s) return res.status(404).json({ error: 'not found' })
  res.json(s)
})

app.get('/openapi.yaml', (req, res) => {
  res.type('yaml').send(require('fs').readFileSync(__dirname + '/openapi.yaml', 'utf8'))
})

const server = http.createServer(app)
const wss = new WebSocketServer({ server, path: '/ws' })

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const sessionId = url.searchParams.get('sessionId')
  if (!sessionId || !sessions.has(sessionId)) {
    ws.send(JSON.stringify({ type: 'error', message: 'invalid session' }))
    ws.close()
    return
  }
  const session = sessions.get(sessionId)
  ws.sessionId = sessionId

  // send initial state
  ws.send(JSON.stringify({ type: 'init', code: session.code }))

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw)
      if (msg.type === 'patch') {
        session.code = msg.code
        // broadcast to all other clients
        wss.clients.forEach((c) => {
          if (c !== ws && c.readyState === 1 && c.sessionId === sessionId) {
            c.send(JSON.stringify({ type: 'update', code: session.code }))
          }
        })
      }
    } catch (e) {
      console.error(e)
    }
  })
})

const start = (port = process.env.PORT || 3000) => {
  return new Promise((resolve) => {
    const listener = server.listen(port, () => {
      const p = listener.address().port
      console.log('Server listening on', p)
      resolve({ server: listener, port: p })
    })
  })
}

if (require.main === module) {
  start()
}

module.exports = { app, server, wss, sessions, start }
