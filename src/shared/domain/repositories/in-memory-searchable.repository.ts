import { Entity } from "../entities/entity";
import { InMemoryRepository } from "./in-memory.repository";
import { SearchableRepositoryInterface, SearchParams, SearchResult } from "./searchable-repository-contract";

export abstract class InMemorySearchableRepository<E extends Entity> extends InMemoryRepository<E> implements SearchableRepositoryInterface<E, any, any> {
  sortableFields: string[] = [];
  async search(props: SearchParams): Promise<SearchResult<E>> {
    const itemsFitlered = await this.applyFilter(this.items, props.filter)
    const itemsSorted = await this.applySort(itemsFitlered, props.sort, props.sortDir)
    const itemsPaginated = await this.applyPaginate(itemsSorted, props.page, props.perPage)

    return new SearchResult({
      items: itemsPaginated,
      total: itemsSorted.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir as any,
      filter: props.filter as any
    })
  }

  protected abstract applyFilter(items: E[], filter: string | null | undefined): Promise<E[]>

  protected async applySort(items: E[], sort: string | null | undefined, sortDir: string | null | undefined): Promise<E[]> {
    if(!sort || !this.sortableFields.includes(sort)) {
      return items
    }

    return items.toSorted((a, b) => {
      if((a.props as any)[sort] < (b.props as any)[sort]) {
        return sortDir === 'asc' ? -1 : 1
      }

      if((a.props as any)[sort] > (b.props as any)[sort]) {
        return sortDir === 'asc' ? 1 : -1
      }

      return 0
    })
  }

  protected async applyPaginate(items: E[], page: SearchParams["page"], perPage: SearchParams["perPage"]): Promise<E[]> {
    const start = (page - 1) * perPage
    const limit = start + perPage

    return items.slice(start, limit)
  }

}
