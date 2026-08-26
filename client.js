window.__ModuleLoader__.load({
  id: 'prompthub-dsh-ecosystem',
  factory: function (require) {
    var module = { exports: {} }
    var exports = module.exports
    var React = require('react')
    var h = React.createElement
    var useEffect = React.useEffect
    var useMemo = React.useMemo
    var useState = React.useState
    var NS = 'prompthub-ecosystem'
    var localeListeners = new Set()

    var zh = {
      nav: 'PromptHub', plugins: 'DSH 插件', skills: 'Skills',
      searchPlugins: '搜索 DSH 插件', searchSkills: '搜索 Skills',
      allCategories: '全部分类', popular: '热门', updated: '最近更新',
      loading: '正在加载目录...', retry: '重试', empty: '没有匹配的资源',
      total: '共 {count} 条', stale: '当前显示上次缓存的数据',
      official: '官方', external: 'GitHub 来源', mirror: 'PromptHub 镜像', hosted: 'PromptHub 托管',
      details: '详情', viewPromptHub: '在 PromptHub 查看', viewSource: '查看 GitHub 源码', copyInstall: '复制安装命令', installCommand: '安装命令',
      copied: '已复制', close: '关闭', source: '来源', category: '分类',
      profiles: 'DSH Profile', platforms: '平台', agents: '支持的 Agent',
      license: '许可证', security: '安全状态', path: 'Skill 路径',
      stars: 'Stars', downloads: '下载/安装', updatedAt: '更新时间',
      risk: '第三方 Plugin 或 Skill 可能访问本地文件、网络或执行代码，请在安装前查看源码和权限要求。',
      loadFailed: '目录加载失败', previous: '上一页', next: '下一页',
    }
    var en = {
      nav: 'PromptHub', plugins: 'DSH Plugins', skills: 'Skills',
      searchPlugins: 'Search DSH plugins', searchSkills: 'Search Skills',
      allCategories: 'All categories', popular: 'Popular', updated: 'Recently updated',
      loading: 'Loading catalog...', retry: 'Retry', empty: 'No matching resources',
      total: '{count} resources', stale: 'Showing the last cached response',
      official: 'Official', external: 'GitHub source', mirror: 'PromptHub mirror', hosted: 'PromptHub hosted',
      details: 'Details', viewPromptHub: 'View on PromptHub', viewSource: 'View GitHub source', copyInstall: 'Copy install command', installCommand: 'Install command',
      copied: 'Copied', close: 'Close', source: 'Source', category: 'Category',
      profiles: 'DSH profiles', platforms: 'Platforms', agents: 'Supported agents',
      license: 'License', security: 'Security', path: 'Skill path',
      stars: 'Stars', downloads: 'Downloads/installs', updatedAt: 'Updated',
      risk: 'Third-party Plugins or Skills may access local files, networks, or execute code. Review the source and permissions before installation.',
      loadFailed: 'Failed to load the catalog', previous: 'Previous', next: 'Next',
    }

    function fallbackLocale() {
      var value = typeof navigator === 'undefined' ? 'zh' : navigator.language
      return String(value || 'zh').toLowerCase().startsWith('zh') ? 'zh' : 'en'
    }

    var activeLocale = fallbackLocale()
    var translate = function (key, vars) {
      var dict = activeLocale === 'zh' ? zh : en
      var value = dict[key] || key
      Object.keys(vars || {}).forEach(function (name) {
        value = value.replace('{' + name + '}', String(vars[name]))
      })
      return value
    }

    function notifyLocale() {
      localeListeners.forEach(function (listener) { listener() })
    }

    function useLocaleRevision() {
      var state = useState(0)
      useEffect(function () {
        var listener = function () { state[1](function (value) { return value + 1 }) }
        localeListeners.add(listener)
        return function () { localeListeners.delete(listener) }
      }, [])
      return state[0]
    }

    function injectStyles() {
      if (document.getElementById('prompthub-ecosystem-styles')) return
      var style = document.createElement('style')
      style.id = 'prompthub-ecosystem-styles'
      style.textContent = [
        '.phe-page{min-height:100%;color:var(--dsw-alias-label-primary);}',
        '.phe-toolbar{display:grid;grid-template-columns:minmax(0,1fr) minmax(170px,220px) minmax(140px,170px);gap:10px;align-items:center;margin-bottom:16px}',
        '.phe-tabs{display:flex;border-bottom:1px solid var(--dsw-alias-border-l2);margin-bottom:16px}',
        '.phe-tab{appearance:none;border:0;border-bottom:2px solid transparent;background:transparent;padding:10px 16px;color:var(--dsw-alias-label-secondary);font-weight:600;cursor:pointer}',
        '.phe-tab-active{border-bottom-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary)}',
        '.phe-input,.phe-select{box-sizing:border-box;height:36px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:0 11px;font:inherit}',
        '.phe-input,.phe-select{width:100%;min-width:0}',
        '.phe-meta{display:flex;align-items-center;justify-content:space-between;gap:12px;margin:0 0 12px;color:var(--dsw-alias-label-tertiary);font-size:12px}',
        '.phe-warning{border:1px solid var(--dsw-alias-state-warn-secondary,#c88a20);border-radius:6px;padding:9px 11px;margin-bottom:12px;color:var(--dsw-alias-state-warn-primary,#a16207);font-size:12px}',
        '.phe-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
        '.phe-card{position:relative;display:flex;min-height:148px;flex-direction:column;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-base);padding:12px;cursor:pointer;transition:border-color .15s,box-shadow .15s}',
        '.phe-card:hover{border-color:var(--dsw-alias-brand-primary);box-shadow:0 8px 22px rgba(0,0,0,.08)}',
        '.phe-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.phe-title{min-width:0;margin:0;font-size:15px;line-height:1.35;overflow-wrap:anywhere}.phe-author{margin-top:3px;color:var(--dsw-alias-label-tertiary);font-size:11px}',
        '.phe-description{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;margin:8px 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5}',
        '.phe-badges{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}.phe-badge{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;padding:2px 6px;color:var(--dsw-alias-label-secondary);font-size:10px}.phe-badge-type{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}',
        '.phe-card-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;border-top:1px solid var(--dsw-alias-border-l2);padding-top:7px;color:var(--dsw-alias-label-tertiary);font-size:11px}',
        '.phe-actions{display:flex;gap:7px}.phe-button{appearance:none;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);padding:6px 9px;font:inherit;font-size:11px;cursor:pointer}.phe-button:hover{border-color:var(--dsw-alias-brand-primary)}.phe-button-primary{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-brand-primary);color:white}',
        '.phe-state{display:flex;min-height:220px;align-items:center;justify-content:center;flex-direction:column;gap:10px;color:var(--dsw-alias-label-secondary)}',
        '.phe-pagination{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:18px}',
        '.phe-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:20px}',
        '.phe-dialog{width:min(760px,100%);max-height:min(760px,88vh);overflow:auto;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-base);padding:24px;box-shadow:0 24px 60px rgba(0,0,0,.25)}',
        '.phe-dialog-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.phe-dialog h2{margin:0;font-size:21px;line-height:1.3}.phe-detail-desc{margin:16px 0 20px;white-space:pre-wrap;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.7}',
        '.phe-dialog-typebar{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-top:10px}',
        '.phe-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 18px;font-size:12px}.phe-field{min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:9px 10px;background:var(--dsw-alias-bg-subtle)}.phe-field-label{margin-bottom:4px;color:var(--dsw-alias-label-tertiary);font-size:11px}.phe-field-value{overflow-wrap:anywhere;color:var(--dsw-alias-label-primary)}',
        '.phe-install{margin:0 0 14px}.phe-install-label{margin-bottom:6px;color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600}.phe-code{overflow:auto;margin:0;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-subtle);padding:10px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.5;white-space:pre-wrap}',
        '.phe-dialog-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid var(--dsw-alias-border-l2)}',
        '@media(max-width:760px){.phe-grid{grid-template-columns:1fr}.phe-toolbar{grid-template-columns:minmax(0,1fr)}}',
        '@media(max-width:640px){.phe-fields{grid-template-columns:1fr}.phe-dialog{padding:16px}}',
      ].join('')
      document.head.appendChild(style)
    }

    function formatCount(value) {
      var number = Number(value || 0)
      if (number >= 1000000) return (number / 1000000).toFixed(number >= 10000000 ? 0 : 1) + 'M'
      if (number >= 1000) return (number / 1000).toFixed(number >= 10000 ? 0 : 1) + 'K'
      return String(number)
    }

    function formatDate(value) {
      if (!value) return '-'
      try { return new Intl.DateTimeFormat(activeLocale === 'zh' ? 'zh-CN' : 'en-US').format(new Date(value)) } catch (_) { return '-' }
    }

    function safePromptHubUrl(value) {
      try {
        var url = new URL(String(value || ''))
        return url.protocol === 'https:' && url.hostname === 'prompthub.xin' ? url.toString() : null
      } catch (_) { return null }
    }

    function copyText(value, done) {
      if (!value) return
      navigator.clipboard.writeText(value).then(function () { done() }).catch(function () {})
    }

    function listText(values) {
      return Array.isArray(values) && values.length ? values.join(', ') : '-'
    }

    function knownText(value) {
      var text = String(value || '').trim()
      return text && text.toLowerCase() !== 'unknown' && text.toLowerCase() !== '未知' ? text : '-'
    }

    function distributionLabel(item) {
      if (item.resource_type === 'plugin') return 'DSH Plugin'
      return translate(item.distribution_mode || 'external')
    }

    function ResourceCard(props) {
      var item = props.item
      var tags = [item.category].concat(item.tags || []).filter(Boolean).filter(function (tag, index, all) { return all.indexOf(tag) === index }).slice(0, 3)
      return h('article', { className: 'phe-card', tabIndex: 0, onClick: props.onOpen, onKeyDown: function (event) { if (event.key === 'Enter' || event.key === ' ') props.onOpen() } },
        h('div', { className: 'phe-card-head' },
          h('div', null,
            h('h3', { className: 'phe-title' }, item.title),
            item.author ? h('div', { className: 'phe-author' }, '@' + item.author) : null
          ),
          item.is_official ? h('span', { className: 'phe-badge' }, translate('official')) : null
        ),
        h('div', { className: 'phe-badges' },
          h('span', { className: 'phe-badge phe-badge-type' }, distributionLabel(item)),
          tags.map(function (tag) { return h('span', { className: 'phe-badge', key: tag }, tag) })
        ),
        h('p', { className: 'phe-description' }, item.description || '-'),
        h('div', { className: 'phe-card-foot' },
          h('span', null, '★ ' + formatCount(item.stars))
        )
      )
    }

    function DetailDialog(props) {
      var item = props.item
      var copiedState = useState(false)
      var copied = copiedState[0]
      var setCopied = copiedState[1]
      if (!item) return null
      var fields = [
        [translate('source'), listText(item.source_catalogs)],
        [translate('stars'), formatCount(item.stars)],
        [translate('downloads'), formatCount(item.downloads)],
        [translate('updatedAt'), formatDate(item.updated_at)],
      ]
      if (item.resource_type === 'plugin') {
        fields.push([translate('profiles'), listText(item.supported_profiles)])
        fields.push([translate('platforms'), listText(item.supported_platforms)])
      } else {
        fields.push([translate('agents'), listText(item.supported_agents)])
        fields.push([translate('path'), item.source_path || '-'])
        fields.push([translate('license'), knownText(item.source_license)])
        fields.push([translate('security'), item.security ? knownText(item.security.status) + ' / ' + knownText(item.security.risk) : '-'])
      }
      var prompthubUrl = safePromptHubUrl(item.prompthub_url)
      var sourceUrl = item.repository_url || item.source_url
      return h('div', { className: 'phe-overlay', role: 'presentation', onMouseDown: function (event) { if (event.target === event.currentTarget) props.onClose() } },
        h('section', { className: 'phe-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': item.title },
          h('div', { className: 'phe-dialog-head' },
            h('div', null,
              h('h2', null, item.title),
              item.author ? h('div', { className: 'phe-author' }, '@' + item.author) : null
            ),
            h('button', { className: 'phe-button', onClick: props.onClose }, '×')
          ),
          h('div', { className: 'phe-dialog-typebar' },
            h('span', { className: 'phe-badge phe-badge-type' }, distributionLabel(item)),
            item.is_official ? h('span', { className: 'phe-badge' }, translate('official')) : null,
            item.category ? h('span', { className: 'phe-badge' }, item.category) : null
          ),
          h('p', { className: 'phe-detail-desc' }, item.description || '-'),
          h('div', { className: 'phe-fields' }, fields.filter(function (field) { return field[1] !== '-' && field[1] !== '- / -' }).map(function (field, index) {
            return h('div', { className: 'phe-field', key: 'f' + index },
              h('div', { className: 'phe-field-label' }, field[0]),
              h('div', { className: 'phe-field-value' }, field[1])
            )
          })),
          item.install_command ? h('div', { className: 'phe-install' },
            h('div', { className: 'phe-install-label' }, translate('installCommand')),
            h('pre', { className: 'phe-code' }, item.install_command)
          ) : null,
          h('div', { className: 'phe-warning' }, translate('risk')),
          h('div', { className: 'phe-dialog-actions' },
            item.install_command ? h('button', { className: 'phe-button', onClick: function () { copyText(item.install_command, function () { setCopied(true); setTimeout(function () { setCopied(false) }, 1500) }) } }, copied ? translate('copied') : translate('copyInstall')) : null,
            sourceUrl ? h('button', { className: 'phe-button', onClick: function () { window.open(sourceUrl, '_blank', 'noopener,noreferrer') } }, translate('viewSource')) : null,
            prompthubUrl ? h('button', { className: 'phe-button phe-button-primary', onClick: function () { window.open(prompthubUrl, '_blank', 'noopener,noreferrer') } }, translate('viewPromptHub')) : null,
            h('button', { className: 'phe-button', onClick: props.onClose }, translate('close'))
          )
        )
      )
    }

    function CatalogSection() {
      useLocaleRevision()
      var typeState = useState('plugin')
      var type = typeState[0]
      var setType = typeState[1]
      var searchInputState = useState('')
      var searchInput = searchInputState[0]
      var setSearchInput = searchInputState[1]
      var searchState = useState('')
      var search = searchState[0]
      var setSearch = searchState[1]
      var categoryState = useState('')
      var category = categoryState[0]
      var setCategory = categoryState[1]
      var sortState = useState('popular')
      var sort = sortState[0]
      var setSort = sortState[1]
      var pageState = useState(1)
      var page = pageState[0]
      var setPage = pageState[1]
      var categoriesState = useState([])
      var categories = categoriesState[0]
      var setCategories = categoriesState[1]
      var resultState = useState({ items: [], pagination: { page: 1, total: 0, totalPages: 0 }, cache: null })
      var result = resultState[0]
      var setResult = resultState[1]
      var loadingState = useState(true)
      var loading = loadingState[0]
      var setLoading = loadingState[1]
      var errorState = useState('')
      var error = errorState[0]
      var setError = errorState[1]
      var reloadState = useState(0)
      var reload = reloadState[0]
      var setReload = reloadState[1]
      var selectedState = useState(null)
      var selected = selectedState[0]
      var setSelected = selectedState[1]

      useEffect(function () {
        var timer = setTimeout(function () { setPage(1); setSearch(searchInput.trim()) }, 300)
        return function () { clearTimeout(timer) }
      }, [searchInput])

      useEffect(function () {
        var controller = new AbortController()
        fetch('/api/prompthub-ecosystem?view=categories&type=' + type + '&locale=' + activeLocale, { signal: controller.signal })
          .then(function (response) { if (!response.ok) throw new Error(String(response.status)); return response.json() })
          .then(function (payload) { setCategories(payload.data && Array.isArray(payload.data.items) ? payload.data.items : []) })
          .catch(function (fetchError) { if (fetchError.name !== 'AbortError') setCategories([]) })
        return function () { controller.abort() }
      }, [type, reload, activeLocale])

      useEffect(function () {
        var controller = new AbortController()
        var params = new URLSearchParams({ type: type, page: String(page), limit: '18', sort: sort, locale: activeLocale })
        if (search) params.set('search', search)
        if (category) params.set('category', category)
        setLoading(true)
        setError('')
        fetch('/api/prompthub-ecosystem?' + params.toString(), { signal: controller.signal })
          .then(function (response) { return response.json().then(function (payload) { if (!response.ok || !payload.success) throw new Error(payload.message || String(response.status)); return payload }) })
          .then(function (payload) {
            setResult({ items: payload.data.items || [], pagination: payload.data.pagination || {}, cache: payload.cache })
            setLoading(false)
          })
          .catch(function (fetchError) { if (fetchError.name !== 'AbortError') { setError(fetchError.message || translate('loadFailed')); setLoading(false) } })
        return function () { controller.abort() }
      }, [type, page, sort, category, search, reload, activeLocale])

      var totalPages = Math.max(1, Number(result.pagination.totalPages || 1))
      var countText = useMemo(function () { return translate('total', { count: Number(result.pagination.total || 0) }) }, [result.pagination.total, activeLocale])

      function switchType(nextType) {
        setType(nextType)
        setCategory('')
        setPage(1)
        setSelected(null)
      }

      return h('div', { className: 'phe-page' },
        h('div', { className: 'phe-tabs' },
          h('button', { className: 'phe-tab ' + (type === 'plugin' ? 'phe-tab-active' : ''), onClick: function () { switchType('plugin') } }, translate('plugins')),
          h('button', { className: 'phe-tab ' + (type === 'skill' ? 'phe-tab-active' : ''), onClick: function () { switchType('skill') } }, translate('skills'))
        ),
        h('div', { className: 'phe-toolbar' },
          h('input', { className: 'phe-input', value: searchInput, placeholder: translate(type === 'plugin' ? 'searchPlugins' : 'searchSkills'), onChange: function (event) { setSearchInput(event.target.value) } }),
          h('select', { className: 'phe-select', value: category, onChange: function (event) { setCategory(event.target.value); setPage(1) } },
            h('option', { value: '' }, translate('allCategories')),
            categories.map(function (item) { return h('option', { value: item.name, key: item.name }, item.name + ' (' + item.count + ')') })
          ),
          h('select', { className: 'phe-select', value: sort, onChange: function (event) { setSort(event.target.value); setPage(1) } },
            h('option', { value: 'popular' }, translate('popular')),
            h('option', { value: 'updated' }, translate('updated'))
          )
        ),
        h('div', { className: 'phe-meta' }, h('span', null, countText), h('span', null, page + ' / ' + totalPages)),
        result.cache === 'stale' ? h('div', { className: 'phe-warning' }, translate('stale')) : null,
        loading ? h('div', { className: 'phe-state' }, translate('loading')) : null,
        !loading && error ? h('div', { className: 'phe-state' }, h('div', null, translate('loadFailed') + ': ' + error), h('button', { className: 'phe-button', onClick: function () { setReload(function (value) { return value + 1 }) } }, translate('retry'))) : null,
        !loading && !error && result.items.length === 0 ? h('div', { className: 'phe-state' }, translate('empty')) : null,
        !loading && !error && result.items.length ? h('div', { className: 'phe-grid' }, result.items.map(function (item) { return h(ResourceCard, { key: item.id, item: item, onOpen: function () { setSelected(item) } }) })) : null,
        !loading && !error && totalPages > 1 ? h('div', { className: 'phe-pagination' },
          h('button', { className: 'phe-button', disabled: page <= 1, onClick: function () { setPage(Math.max(1, page - 1)) } }, translate('previous')),
          h('span', null, page + ' / ' + totalPages),
          h('button', { className: 'phe-button', disabled: page >= totalPages, onClick: function () { setPage(Math.min(totalPages, page + 1)) } }, translate('next'))
        ) : null,
        selected ? h(DetailDialog, { item: selected, onClose: function () { setSelected(null) } }) : null
      )
    }

    function apply(ctx) {
      injectStyles()
      if (ctx.locale && typeof ctx.locale.register === 'function') {
        ctx.effect(function () { return ctx.locale.register(NS, { zh: zh, en: en }) }, 'prompthub-ecosystem: dictionaries')
        translate = ctx.locale.bind(NS)
        try { activeLocale = ctx.locale.getLocale().active || activeLocale } catch (_) {}
        if (typeof ctx.locale.subscribe === 'function') {
          ctx.effect(function () { return ctx.locale.subscribe(function () {
            try { activeLocale = ctx.locale.getLocale().active || activeLocale } catch (_) {}
            notifyLocale()
          }) }, 'prompthub-ecosystem: locale changes')
        }
      }
      ctx.slots.inject('settings.section', function () {
        return ctx.slots.register({
          name: 'settings.section',
          id: 'prompthub-ecosystem',
          order: 35,
          locale: NS,
          label: function () { return translate('nav') },
        }, CatalogSection)
      })
    }

    exports.apply = apply
    exports.inject = ['slots', 'locale']
    return module.exports
  },
})
