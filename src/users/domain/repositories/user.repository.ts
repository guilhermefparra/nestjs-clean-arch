import { UserEntity } from "../entities/user.entity";
import { SearchableRepositoryInterface, SearchParams as DefaultSearchParams, SearchResult as DefaultSearchResult } from "@/shared/domain/repositories/searchable-repository-contract";

export namespace UserRepository {
  export type Filter = string;
  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<UserEntity, Filter> {}

  export interface UserRepository extends SearchableRepositoryInterface<UserEntity, any, any> {
    findByEmail(email: string): Promise<UserEntity>;
    emailExists(email: string): Promise<void>;
  }
}
