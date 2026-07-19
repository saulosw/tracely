// Composition root: env config, dependency wiring, and server bootstrap live here.
import express from 'express'

const app = express()
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const port = Number(process.env.PORT ?? 3333)
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`)
})
