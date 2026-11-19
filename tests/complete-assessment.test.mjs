import assert from 'node:assert/strict'
import test from 'node:test'
import { completeAssessment } from '../src/utils/complete-assessment.mjs'

const chart = { trabajo: [1, 2, 3, 4], personal: [4, 3, 2, 1], clasico: [2, 1, 4, 3] }
const id = '00000000-0000-4000-8000-000000000001'
const options = (overrides = {}) => ({
  endpoint: 'https://scoring.example.test',
  body: { mas_array: [1], menos_array: [2] },
  user: { email: 'test@example.test' },
  attempt: { id },
  fetchScore: async () => ({ ok: true, json: async () => ({ chart }) }),
  saveUser: async ({ attemptId }) => attemptId,
  ...overrides,
})

test('scores then saves a valid result, with only necessary request headers', async () => {
  const calls = []
  const a = options({
    fetchScore: async (url, init) => {
      calls.push('score')
      assert.equal(url, a.endpoint)
      assert.deepEqual(init.headers, { 'Content-Type': 'application/json' })
      assert.deepEqual(JSON.parse(init.body), a.body)
      return { ok: true, json: async () => ({ chart }) }
    },
    saveUser: async ({ attemptId, user }) => {
      calls.push('save')
      assert.deepEqual(user.result.chart, chart)
      assert.equal(user.email, a.user.email)
      return attemptId
    },
  })
  assert.equal(await completeAssessment(a), id)
  assert.deepEqual(calls, ['score', 'save'])
})

for (const [name, fetchScore] of [
  ['HTTP error', async () => ({ ok: false, json: async () => ({ chart }) })],
  ['network rejection', async () => { throw new TypeError('Failed to fetch') }],
  ['invalid JSON', async () => ({ ok: true, json: () => JSON.parse('<html>') })],
  ['malformed result', async () => ({ ok: true, json: async () => ({ chart: {} }) })],
]) {
  test(`never persists after a scoring ${name}`, async () => {
    const a = options({ fetchScore, saveUser: async () => assert.fail('must not save') })
    await assert.rejects(completeAssessment(a), /calcular el resultado/)
    assert.equal(a.attempt.record, undefined)
    assert.deepEqual(a.body, { mas_array: [1], menos_array: [2] })
  })
}

test('deadline also covers reading the scoring response body and signals abort', async () => {
  let signal
  const a = options({
    scoreTimeout: 25,
    fetchScore: async (_, init) => {
      signal = init.signal
      return { ok: true, json: async () => new Promise(() => {}) }
    },
    saveUser: async () => assert.fail('must not save'),
  })
  await assert.rejects(completeAssessment(a), /calcular el resultado/)
  assert.equal(signal.aborted, true)
})

test('missing scoring configuration produces an actionable error with no request', async () => {
  await assert.rejects(
    completeAssessment(options({ endpoint: undefined, fetchScore: async () => assert.fail('must not fetch') })),
    /calcular el resultado/,
  )
})

test('no success for missing or unrelated saved document ID', async () => {
  for (const value of [undefined, 'unrelated']) {
    await assert.rejects(completeAssessment(options({ saveUser: async () => value })), /se guardó/)
  }
})

test('retry uses exact same document ID and scored payload after a save failure', async () => {
  let fetchCount = 0
  const saves = []
  const a = options({
    fetchScore: async () => { fetchCount++; return { ok: true, json: async () => ({ chart }) } },
    saveUser: async (args) => {
      saves.push(args)
      if (saves.length === 1) throw new Error('denied')
      return args.attemptId
    },
  })
  await assert.rejects(completeAssessment(a), /se guardó/)
  assert.equal(await completeAssessment(a), id)
  assert.equal(fetchCount, 1)
  assert.deepEqual(saves[0], saves[1])
})

test('retry after uncertain save timeout does not create a new record', async () => {
  let resolveFirst
  const documents = new Map()
  const a = options({
    saveTimeout: 25,
    saveUser: async ({ attemptId, user }) => {
      if (!resolveFirst) {
        return new Promise((resolve) => {
          resolveFirst = () => { documents.set(attemptId, user); resolve(attemptId) }
        })
      }
      if (!documents.has(attemptId)) documents.set(attemptId, user)
      return attemptId
    },
  })
  await assert.rejects(completeAssessment(a), /se guardó/)
  resolveFirst()
  assert.equal(await completeAssessment(a), id)
  assert.equal(documents.size, 1)
})
