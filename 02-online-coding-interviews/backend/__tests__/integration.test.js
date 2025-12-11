const request = require('supertest')
const WebSocket = require('ws')
const { start, sessions } = require('../server')

let srv
beforeAll(async () => {
  const res = await start(0)
  srv = res.server
})

afterAll(async () => {
  await new Promise((r) => srv.close(r))
})

test('create session and realtime sync via websocket', async () => {
  const base = `http://127.0.0.1:${srv.address().port}`
  // create session
  const res = await request(base).post('/api/sessions')
  expect(res.status).toBe(200)
  const { id } = res.body
  expect(id).toBeTruthy()

  // connect two ws clients
  const url = `ws://127.0.0.1:${srv.address().port}/ws?sessionId=${id}`

  const c1 = new WebSocket(url)
  const c2 = new WebSocket(url)

  const waitFor = (ws) => new Promise((resolve) => ws.once('message', (m) => resolve(JSON.parse(m))))

  const init1 = await waitFor(c1)
  const init2 = await waitFor(c2)
  expect(init1.type).toBe('init')
  expect(init2.type).toBe('init')

  const newCode = '// hello from c1'

  const notify = new Promise((resolve) => {
    c2.once('message', (m) => {
      const msg = JSON.parse(m)
      resolve(msg)
    })
  })

  // send patch from c1
  c1.send(JSON.stringify({ type: 'patch', code: newCode }))

  const msg = await notify
  expect(msg.type).toBe('update')
  expect(msg.code).toBe(newCode)

  c1.close()
  c2.close()
})
