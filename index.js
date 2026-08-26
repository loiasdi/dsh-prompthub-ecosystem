import { createRequire } from 'node:module'

const ROUTE_PATH = '/api/prompthub-ecosystem'
const { version: PLUGIN_VERSION } = createRequire(import.meta.url)('./package.json')
const DEFAULT_CONFIG = Object.freeze({
  apiBaseUrl: 'https://prompthub.xin/api',
  requestTimeoutMs: 12000,
  cacheTtlMs: 300000,
})
const MAX_RESPONSE_BYTES = 4 * 1024 * 1024
const ALLOWED_LIST_PARAMS = new Set([
  'agent', 'category', 'page', 'platform', 'profile', 'search', 'sort',
])

export const name = 'prompthub-dsh-ecosystem'
export const inject = ['webServer']

function json(res, status, payload) {
  res.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  })
  res.end(JSON.stringify(payload))
}

function asPositiveInteger(value, fallback, maximum) {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.min(parsed, maximum)
}

function resolveConfig(config = {}) {
  const apiBaseUrl = new URL(String(config.apiBaseUrl || DEFAULT_CONFIG.apiBaseUrl))
  if (!['http:', 'https:'].includes(apiBaseUrl.protocol)) {
    throw new Error('prompthub-ecosystem: apiBaseUrl must use http or https')
  }
  return {
    apiBaseUrl: apiBaseUrl.toString().replace(/\/$/, ''),
    requestTimeoutMs: asPositiveInteger(config.requestTimeoutMs, DEFAULT_CONFIG.requestTimeoutMs, 60000),
    cacheTtlMs: asPositiveInteger(config.cacheTtlMs, DEFAULT_CONFIG.cacheTtlMs, 3600000),
  }
}

function safeUrl(value) {
  if (!value) return null
  try {
    const url = new URL(String(value))
    return url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

function localizedDescription(item, locale) {
  if (locale === 'en') return item.description_en || item.description || item.description_zh || ''
  return item.description_zh || item.description || item.description_en || ''
}

function normalizePlugin(item, locale) {
  return {
    resource_type: 'plugin',
    id: `plugin:${item.id}`,
    source_id: item.id,
    slug: item.slug,
    title: item.title || item.canonical_name || '',
    description: localizedDescription(item, locale),
    category: item.category || 'other',
    tags: Array.isArray(item.tags) ? item.tags : [],
    author: item.author_name || null,
    repository_url: safeUrl(item.repository_url),
    source_url: safeUrl(item.source_url),
    prompthub_url: `https://prompthub.xin/plugins/${encodeURIComponent(item.slug)}`,
    package_name: item.npm_package || null,
    install_command: item.install_command || null,
    stars: Number(item.stars || 0),
    downloads: Number(item.downloads || 0),
    supported_profiles: Array.isArray(item.supported_profiles) ? item.supported_profiles : [],
    supported_platforms: Array.isArray(item.supported_platforms) ? item.supported_platforms : [],
    source_catalogs: Array.isArray(item.source_catalogs) ? item.source_catalogs : [],
    is_official: Boolean(item.is_official),
    security: null,
    updated_at: item.updated_at || null,
  }
}

function normalizeSkill(item, locale) {
  return {
    resource_type: 'skill',
    id: `skill:${item.id}`,
    source_id: item.id,
    slug: item.slug,
    title: item.title || '',
    description: localizedDescription(item, locale),
    category: item.category || 'other',
    tags: Array.isArray(item.tags) ? item.tags : [],
    author: item.publisher_name || item.owner_name || null,
    repository_url: safeUrl(item.repository_url),
    source_url: safeUrl(item.source_url),
    prompthub_url: `https://prompthub.xin/skills/${encodeURIComponent(item.slug)}`,
    package_name: null,
    install_command: null,
    stars: Number(item.upstream_stars || 0),
    downloads: Number(item.upstream_installs || item.installs || 0),
    supported_agents: Array.isArray(item.supported_agents) ? item.supported_agents : [],
    source_catalogs: Array.isArray(item.source_catalogs) ? item.source_catalogs : [],
    source_path: item.source_path || null,
    distribution_mode: item.distribution_mode || 'external',
    mirror_available: Boolean(item.mirror_available),
    source_license: item.source_license || null,
    is_official: Boolean(item.is_official),
    security: item.security && typeof item.security === 'object' ? item.security : null,
    updated_at: item.updated_at || null,
  }
}

export function normalizeRemoteItem(type, item, locale = 'zh') {
  return type === 'plugin' ? normalizePlugin(item, locale) : normalizeSkill(item, locale)
}

function buildRemoteUrl(config, requestUrl) {
  const type = requestUrl.searchParams.get('type') === 'skill' ? 'skill' : 'plugin'
  const locale = requestUrl.searchParams.get('locale') === 'en' ? 'en' : 'zh'
  const view = requestUrl.searchParams.get('view') || 'list'
  let path
  if (view === 'categories') {
    path = type === 'plugin' ? '/dsh/plugins/categories' : '/skills/categories'
  } else if (view === 'detail') {
    const slug = String(requestUrl.searchParams.get('slug') || '').trim()
    if (!slug || slug.length > 180) throw new Error('invalid resource slug')
    path = type === 'plugin'
      ? `/dsh/plugins/${encodeURIComponent(slug)}`
      : `/skills/${encodeURIComponent(slug)}`
  } else {
    path = type === 'plugin' ? '/dsh/plugins' : '/skills'
  }

  const remote = new URL(`${config.apiBaseUrl}${path}`)
  if (view === 'list') {
    for (const [key, value] of requestUrl.searchParams.entries()) {
      if (ALLOWED_LIST_PARAMS.has(key) && value.length <= 100) remote.searchParams.set(key, value)
    }
    remote.searchParams.set('limit', String(asPositiveInteger(requestUrl.searchParams.get('limit'), 18, 24)))
  }
  remote.searchParams.set('locale', locale)
  return { remote, type, view, locale }
}

async function fetchJson(url, timeoutMs) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': `prompthub-dsh-ecosystem/${PLUGIN_VERSION}`,
    },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!response.ok) throw new Error(`PromptHub API returned ${response.status}`)
  const contentLength = Number(response.headers.get('content-length') || 0)
  if (contentLength > MAX_RESPONSE_BYTES) throw new Error('PromptHub API response is too large')
  const body = await response.text()
  if (Buffer.byteLength(body) > MAX_RESPONSE_BYTES) throw new Error('PromptHub API response is too large')
  return JSON.parse(body)
}

function normalizePayload(type, view, payload, locale) {
  if (view === 'categories') {
    return {
      items: Array.isArray(payload.data)
        ? payload.data.map(item => ({ name: String(item.name || ''), count: Number(item.count ?? item.skill_count ?? 0) }))
        : [],
    }
  }
  if (view === 'detail') {
    return { item: payload.data ? normalizeRemoteItem(type, payload.data, locale) : null }
  }
  return {
    items: Array.isArray(payload.data) ? payload.data.map(item => normalizeRemoteItem(type, item, locale)) : [],
    pagination: payload.pagination || { page: 1, limit: 18, total: 0, totalPages: 0 },
  }
}

export function createCatalogHandler(configInput = {}) {
  const config = resolveConfig(configInput)
  const cache = new Map()

  return async (req, res) => {
    if (req.method !== 'GET') return json(res, 405, { success: false, message: 'Method not allowed' })

    let target
    try {
      const requestUrl = new URL(req.url || ROUTE_PATH, 'http://localhost')
      target = buildRemoteUrl(config, requestUrl)
    } catch (error) {
      return json(res, 400, { success: false, message: error instanceof Error ? error.message : 'Invalid request' })
    }

    const cacheKey = target.remote.toString()
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.fetchedAt < config.cacheTtlMs) {
      return json(res, 200, { success: true, data: cached.data, cache: 'fresh', fetched_at: cached.fetchedAt })
    }

    try {
      const payload = await fetchJson(target.remote, config.requestTimeoutMs)
      const data = normalizePayload(target.type, target.view, payload, target.locale)
      const fetchedAt = Date.now()
      cache.set(cacheKey, { data, fetchedAt })
      return json(res, 200, { success: true, data, cache: 'network', fetched_at: fetchedAt })
    } catch (error) {
      if (cached) {
        return json(res, 200, {
          success: true,
          data: cached.data,
          cache: 'stale',
          fetched_at: cached.fetchedAt,
          warning: 'PromptHub is temporarily unavailable; showing cached data.',
        })
      }
      return json(res, 502, {
        success: false,
        message: error instanceof Error ? error.message : 'PromptHub is temporarily unavailable',
      })
    }
  }
}

export function apply(ctx, config) {
  const dispose = ctx.webServer.register({
    kind: 'exact',
    path: ROUTE_PATH,
    handler: createCatalogHandler(config),
  })
  ctx.effect(() => dispose, 'prompthub-ecosystem: catalog proxy')
}
