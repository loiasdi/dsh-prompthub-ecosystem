import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

test('client bundle registers a first-level DSH Settings section', async () => {
  const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
  let definition
  const appended = []
  const context = {
    URL,
    URLSearchParams,
    Intl,
    Set,
    clearTimeout,
    setTimeout,
    navigator: { language: 'zh-CN', clipboard: { writeText: async () => {} } },
    document: {
      getElementById: () => null,
      createElement: () => ({}),
      head: { appendChild: value => appended.push(value) },
    },
    window: {
      __ModuleLoader__: { load: value => { definition = value } },
      open: () => {},
    },
  }
  vm.runInNewContext(source, context)
  assert.equal(definition.id, 'prompthub-dsh-ecosystem')

  const React = {
    createElement: () => null,
    useEffect: () => {},
    useMemo: value => value(),
    useState: value => [value, () => {}],
  }
  const client = definition.factory(name => {
    assert.equal(name, 'react')
    return React
  })
  let registered
  const ctx = {
    effect: effect => { effect() },
    locale: {
      bind: () => key => key,
      getLocale: () => ({ active: 'zh' }),
      register: () => () => {},
      subscribe: () => () => {},
    },
    slots: {
      inject: (name, setup) => {
        assert.equal(name, 'settings.section')
        setup()
      },
      register: (options, component) => {
        registered = { options, component }
        return () => {}
      },
    },
  }

  client.apply(ctx)
  assert.equal(appended.length, 1)
  assert.equal(registered.options.id, 'prompthub-ecosystem')
  assert.equal(registered.options.name, 'settings.section')
  assert.equal(typeof registered.component, 'function')
  assert.deepEqual(Array.from(client.inject), ['slots', 'locale'])
})
