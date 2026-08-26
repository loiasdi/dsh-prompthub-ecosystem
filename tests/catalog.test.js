import assert from 'node:assert/strict'
import test from 'node:test'
import { createCatalogHandler, normalizeRemoteItem } from '../index.js'

function responseRecorder() {
  return {
    status: null,
    headers: null,
    body: null,
    writeHead(status, headers) {
      this.status = status
      this.headers = headers
    },
    end(body) {
      this.body = body
    },
  }
}

async function invoke(handler, url, method = 'GET') {
  const response = responseRecorder()
  await handler({ method, url }, response)
  return { status: response.status, payload: JSON.parse(response.body) }
}

function remoteResponse(payload) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

test('normalizes Plugin and Skill records without exposing unsafe URLs', () => {
  const plugin = normalizeRemoteItem('plugin', {
    id: 1,
    slug: 'demo-plugin',
    title: 'Demo Plugin',
    repository_url: 'javascript:alert(1)',
    stars: 12,
    supported_profiles: ['web'],
  })
  const skill = normalizeRemoteItem('skill', {
    id: 2,
    slug: 'demo-skill',
    title: 'Demo Skill',
    repository_url: 'https://github.com/example/demo',
    upstream_stars: 8,
    distribution_mode: 'external',
  })

  assert.equal(plugin.id, 'plugin:1')
  assert.equal(plugin.repository_url, null)
  assert.deepEqual(plugin.supported_profiles, ['web'])
  assert.equal(skill.id, 'skill:2')
  assert.equal(skill.repository_url, 'https://github.com/example/demo')
  assert.equal(skill.stars, 8)
})

test('proxies Plugin list requests and returns a unified response', async t => {
  const originalFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = originalFetch })
  let requestedUrl
  globalThis.fetch = async url => {
    requestedUrl = String(url)
    return remoteResponse({
      success: true,
      data: [{ id: 7, slug: 'plugin-seven', title: 'Plugin Seven', stars: 70 }],
      pagination: { page: 2, limit: 18, total: 20, totalPages: 2 },
    })
  }

  const handler = createCatalogHandler({ apiBaseUrl: 'https://example.test/api' })
  const result = await invoke(handler, '/api/prompthub-ecosystem?type=plugin&page=2&search=video&limit=999')

  assert.equal(result.status, 200)
  assert.match(requestedUrl, /\/api\/dsh\/plugins/)
  assert.match(requestedUrl, /page=2/)
  assert.match(requestedUrl, /limit=24/)
  assert.equal(result.payload.data.items[0].resource_type, 'plugin')
  assert.equal(result.payload.data.pagination.total, 20)
})

test('proxies Skill categories and preserves counts', async t => {
  const originalFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = async url => {
    assert.match(String(url), /\/api\/skills\/categories/)
    return remoteResponse({ success: true, data: [{ name: 'development', count: 23 }] })
  }

  const handler = createCatalogHandler({ apiBaseUrl: 'https://example.test/api' })
  const result = await invoke(handler, '/api/prompthub-ecosystem?view=categories&type=skill&locale=en')

  assert.equal(result.status, 200)
  assert.deepEqual(result.payload.data.items, [{ name: 'development', count: 23 }])
})

test('falls back to stale cache when PromptHub is temporarily unavailable', async t => {
  const originalFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = originalFetch })
  let calls = 0
  globalThis.fetch = async () => {
    calls += 1
    if (calls === 1) {
      return remoteResponse({ success: true, data: [], pagination: { page: 1, total: 0, totalPages: 0 } })
    }
    throw new Error('offline')
  }

  const handler = createCatalogHandler({ apiBaseUrl: 'https://example.test/api', cacheTtlMs: 1 })
  const first = await invoke(handler, '/api/prompthub-ecosystem?type=skill')
  await new Promise(resolve => setTimeout(resolve, 5))
  const second = await invoke(handler, '/api/prompthub-ecosystem?type=skill')

  assert.equal(first.payload.cache, 'network')
  assert.equal(second.status, 200)
  assert.equal(second.payload.cache, 'stale')
})

test('rejects write methods and invalid detail slugs', async () => {
  const handler = createCatalogHandler({ apiBaseUrl: 'https://example.test/api' })
  const write = await invoke(handler, '/api/prompthub-ecosystem', 'POST')
  const invalid = await invoke(handler, '/api/prompthub-ecosystem?view=detail&type=plugin')

  assert.equal(write.status, 405)
  assert.equal(invalid.status, 400)
})
