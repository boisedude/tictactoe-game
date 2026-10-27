import { getInitialDifficulty } from '@/hooks/useCharacterSelection'

describe('?character= sets difficulty', () => {
  function setSearch(search: string) {
    window.history.pushState({}, '', `/${search}`)
  }

  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it.each([
    ['?character=bentley', 'hard'],
    ['?character=bella', 'easy'],
    ['?character=coop', 'medium'],
    ['?character=nope', 'medium'],
    ['', 'medium'],
  ])('%s -> %s', (search, expected) => {
    setSearch(search)
    expect(getInitialDifficulty()).toBe(expected)
  })
})
