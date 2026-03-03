import { Entity } from "@/shared/domain/entities/entity";
import { InMemorySearchableRepository } from "../../in-memory-searchable.repository";
import { SearchParams, SearchResult } from "../../searchable-repository-contract";


type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];
  protected async applyFilter(items: StubEntity[], filter: string | null | undefined): Promise<StubEntity[]> {
    if(!filter) {
      return items
    }

    return items.filter(i => i.props.name.toLowerCase().includes(filter.toLowerCase()))
  }
}

describe("InMemorySearchableRepository Unit Tests", () => {
  let repository: StubInMemorySearchableRepository

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository()
  })

  describe("applyFilter method", () => {
    it("should no filter when filter param is null or empty", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "fake", price: 5 }),
      ]

      const spyFilterMethod = jest.spyOn(items, 'filter' as any)

      let result = await repository["applyFilter"](items, null)
      expect(result).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()

      result = await repository["applyFilter"](items, undefined)
      expect(result).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()

      result = await repository["applyFilter"](items, '')
      expect(result).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it("should filter using the filter param", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "fake", price: 5 }),
      ]

      const spyFilterMethod = jest.spyOn(items, 'filter' as any)

      let result = await repository["applyFilter"](items, 'TEST')
      expect(result).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      result = await repository["applyFilter"](items, 'test')
      expect(result).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      result = await repository["applyFilter"](items, 'no-filter')
      expect(result).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
    })
  })

  describe("applySort method", () => {
    it("should no sort items", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "fake", price: 5 }),
      ]

      const spySortMethod = jest.spyOn(items, 'toSorted' as any)

      let result = await repository["applySort"](items, null, null)
      expect(result).toStrictEqual(items)
      expect(spySortMethod).not.toHaveBeenCalled()

      result = await repository["applySort"](items, undefined, undefined)
      expect(result).toStrictEqual(items)
      expect(spySortMethod).not.toHaveBeenCalled()

      result = await repository["applySort"](items, '', '')
      expect(result).toStrictEqual(items)
      expect(spySortMethod).not.toHaveBeenCalled()

            result = await repository["applySort"](items, 'price', 'asc')
      expect(result).toStrictEqual(items)
      expect(spySortMethod).not.toHaveBeenCalled()
    })

    it("should sort if sort param is a valid field", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
      ]

      let result = await repository["applySort"](items, 'name', 'asc')
      expect(result).toStrictEqual([items[2], items[0], items[1]])

      result = await repository["applySort"](items, 'name', 'desc')
      expect(result).toStrictEqual([items[1], items[0], items[2]])
    })
  })

  describe("applyPaginate method", () => {
    it("should paginate items", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
      ]

      let result = await repository["applyPaginate"](items, 1, 2)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await repository["applyPaginate"](items, 2, 2)
      expect(result).toStrictEqual([items[2]])

      result = await repository["applyPaginate"](items, 3, 2)
      expect(result).toStrictEqual([])
    })
  })

  describe("search method", () => {
    it("should apply only pagination when the other params are null", async () => {
      const entity = new StubEntity({ name: "test", price: 5 })
      repository.items = Array(16).fill(entity)

      const result = await repository.search(new SearchParams())
      expect(result).toStrictEqual(new SearchResult({
        items: Array(15).fill(entity),
        total: 16,
        currentPage: 1,
        perPage: 15,
        sort: null,
        sortDir: null,
        filter: null
      }))
    })

    it("should apply paginate and filter", async () => {
      const items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "TeSt", price: 5 }),
      ]
      repository.items = items

      let result = await repository.search(new SearchParams({page: 1, perPage: 2, filter: 'TEST'}))
      expect(result).toStrictEqual(new SearchResult({
        items: [items[0], items[1]],
        total: 3,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: 'TEST'
      }))

      result = await repository.search(new SearchParams({page: 2, perPage: 2, filter: 'TEST'}))
      expect(result).toStrictEqual(new SearchResult({
        items: [items[3]],
        total: 3,
        currentPage: 2,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: 'TEST'
      }))
    })

    it("Should apply paginate and sort", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "d", price: 5 }),
        new StubEntity({ name: "e", price: 5 }),
      ]
      repository.items = items

      let result = await repository.search(new SearchParams({page: 1, perPage: 2, sort: 'name'}))
      expect(result).toStrictEqual(new SearchResult({
        items: [items[2], items[0]],
        total: 5,
        currentPage: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: null
      }))

      result = await repository.search(new SearchParams({page: 2, perPage: 2, sort: 'name', sortDir: 'asc'}))
      expect(result).toStrictEqual(new SearchResult({
        items: [items[1], items[3]],
        total: 5,
        currentPage: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: null
      }))

      result = await repository.search(new SearchParams({page: 3, perPage: 2, sort: 'name', sortDir: 'desc'}))
      expect(result).toStrictEqual(new SearchResult({
        items: [items[2]],
        total: 5,
        currentPage: 3,
        perPage: 2,
        sort: 'name',
        sortDir: 'desc',
        filter: null
      }))
    })

    it("should apply paginate, sort and filter", async () => {
      const items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "d", price: 5 }),
        new StubEntity({ name: "e", price: 5 }),
        new StubEntity({ name: "ee", price: 5 }),
        new StubEntity({ name: "E", price: 5 }),
        new StubEntity({ name: "EE", price: 5 }),

      ]
      repository.items = items

      let result = await repository.search(new SearchParams({page: 1, perPage: 2, sort: 'name', filter: 'e'}))
      expect(result).toStrictEqual(new SearchResult({
        items: [items[6], items[7]],
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'e'
      }))

      result = await repository.search(new SearchParams({page: 2, perPage: 2, sort: 'name', sortDir: 'asc', filter: 'e'}))
      expect(result).toStrictEqual(new SearchResult({
        items: [ items[4], items[5]],
        total: 4,
        currentPage: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'e'
      }))

      result = await repository.search(new SearchParams({page: 1, perPage: 4, sort: 'name', sortDir: 'desc', filter: 'e'}))
      expect(result).toStrictEqual(new SearchResult({
        items: [items[5], items[4], items[7], items[6]],
        total: 4,
        currentPage: 1,
        perPage: 4,
        sort: 'name',
        sortDir: 'desc',
        filter: 'e'
      }))

      result = await repository.search(new SearchParams({page: 10, perPage: 4, sort: 'name', sortDir: 'desc', filter: 'e'}))
      expect(result).toStrictEqual(new SearchResult({
        items: [],
        total: 4,
        currentPage: 10,
        perPage: 4,
        sort: 'name',
        sortDir: 'desc',
        filter: 'e'
      }))
    })
  })
})
