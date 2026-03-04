import { PaginationOutputMapper } from "../../pagination-output";
import { SearchResult } from "@/shared/domain/repositories/searchable-repository-contract";

describe("PaginationOutputMapper unit tests", () => {
  it("should convert a SearchResult to a PaginationOutput", () => {
    const result = new SearchResult({
      items: ['a'] as any,
      total: 1,
      currentPage: 1,
      perPage: 10,
      sort: '',
      sortDir: 'asc',
      filter: 'fake'
    });

    const sut = PaginationOutputMapper.toOutput(result.items, result);
    expect(sut).toStrictEqual({
      items: ['a'],
      total: 1,
      currentPage: 1,
      perPage: 10,
      lastPage: 1
    });
  });
});
