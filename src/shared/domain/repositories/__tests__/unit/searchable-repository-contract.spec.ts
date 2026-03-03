import { SearchParams, SearchResult } from "../../searchable-repository-contract"

describe("Searchable Respository unit tests", () => {

  describe("SearchParams tests", () => {

    it("Page prop", () => {
      const sut = new SearchParams()
      expect(sut.page).toBe(1)

      const params = [
        { page: null as any, expect: 1 },
        { page: undefined as any, expect: 1 },
        { page: '' as any, expect: 1 },
        { page: 'test' as any, expect: 1 },
        { page: 0, expect: 1 },
        { page: -1, expect: 1 },
        { page: 5.5, expect: 1 },
        { page: true as any, expect: 1 },
        { page: false as any, expect: 1 },
        { page: {} as any, expect: 1 },
        { page: 1, expect: 1 },
        { page: 2, expect: 2 },
      ]

      params.forEach((it) => {
        const sut = new SearchParams({page: it.page})
        expect(sut.page).toBe(it.expect)
      })
    })

    it("Per page prop", () => {
      const sut = new SearchParams()
      expect(sut.perPage).toBe(15)

      const params = [
        { perPage: null as any, expect: 15 },
        { perPage: undefined as any, expect: 15 },
        { perPage: '' as any, expect: 15 },
        { perPage: 'test' as any, expect: 15 },
        { perPage: 0, expect: 15 },
        { perPage: -1, expect: 15 },
        { perPage: 5.5, expect: 15 },
        { perPage: true as any, expect: 15 },
        { perPage: false as any, expect: 15 },
        { perPage: {} as any, expect: 15 },
        { perPage: 15, expect: 15 },
        { perPage: 2, expect: 2 },
      ]

      params.forEach((it) => {
        const sut = new SearchParams({perPage: it.perPage})
        expect(sut.perPage).toBe(it.expect)
      })
    })

    it("Sort prop", () => {
      const sut = new SearchParams()
      expect(sut.sort).toBeNull()

      const params = [
        { sort: null as any, expect: null },
        { sort: undefined as any, expect: null },
        { sort: '', expect: null },
        { sort: 'test', expect: 'test' },
        { sort: 0, expect: '0' },
        { sort: -1, expect: '-1' },
        { sort: 5.5, expect: '5.5' },
        { sort: true as any, expect: 'true' },
        { sort: false as any, expect: 'false' },
        { sort: {} as any, expect: '[object Object]' },
        { sort: [] as any, expect: '' },
      ]

      params.forEach((it) => {
        const sut = new SearchParams({sort: it.sort})
        expect(sut.sort).toBe(it.expect)
      })
    })

    it("Sort dir prop", () => {
      let sut = new SearchParams()
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: null })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: undefined })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: '' })
      expect(sut.sortDir).toBeNull()

      const params = [
        { sortDir: null as any, expect: 'asc' },
        { sortDir: undefined as any, expect: 'asc' },
        { sortDir: '', expect: 'asc' },
        { sortDir: 'test', expect: 'asc' },
        { sortDir: 0, expect: 'asc' },
        { sortDir: -1, expect: 'asc' },
        { sortDir: 5.5, expect: 'asc' },
        { sortDir: true as any, expect: 'asc' },
        { sortDir: false as any, expect: 'asc' },
        { sortDir: {} as any, expect: 'asc' },
        { sortDir: [] as any, expect: 'asc' },
        { sortDir: 'desc' as any, expect: 'desc' },
        { sortDir: 'DESC' as any, expect: 'desc' },
        { sortDir: 'asc' as any, expect: 'asc' },
        { sortDir: 'ASC' as any, expect: 'asc' },
      ]

      params.forEach((it) => {
        const sut = new SearchParams({sort: 'test', sortDir: it.sortDir})
        expect(sut.sortDir).toBe(it.expect)
      })
    })

    it("Filter prop", () => {
      const sut = new SearchParams()
      expect(sut.filter).toBeNull()

      const params = [
        { filter: null as any, expect: null },
        { filter: undefined as any, expect: null },
        { filter: '', expect: null },
        { filter: 'test', expect: 'test' },
        { filter: 0, expect: '0' },
        { filter: -1, expect: '-1' },
        { filter: 5.5, expect: '5.5' },
        { filter: true as any, expect: 'true' },
        { filter: false as any, expect: 'false' },
        { filter: {} as any, expect: '[object Object]' },
        { filter: [] as any, expect: '' },
      ]

      params.forEach((it) => {
        const sut = new SearchParams({filter: it.filter})
        expect(sut.filter).toBe(it.expect)
      })
    })
  })

  describe("SearchResult tests", () => {
    it('constructor props', () => {
      let sut = new SearchResult({
        items: ['test1','test2','test3','test4',] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null
      })
      expect(sut.toJSON()).toStrictEqual({
        items: ['test1','test2','test3','test4',] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: null,
        sortDir: null,
        filter: null
      })

      sut = new SearchResult({
        items: ['test1','test2','test3','test4',] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test' as any
      })
      expect(sut.toJSON()).toStrictEqual({
        items: ['test1','test2','test3','test4',] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test'
      })

      sut = new SearchResult({
        items: ['test1','test2','test3','test4',] as any,
        total: 4,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test' as any
      })
      expect(sut.lastPage).toBe(1)

      sut = new SearchResult({
        items: ['test1','test2','test3','test4',] as any,
        total: 54,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test' as any
      })
      expect(sut.lastPage).toBe(6)
    })
  })
})
