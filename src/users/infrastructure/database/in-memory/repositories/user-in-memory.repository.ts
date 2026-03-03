import { ConflictError } from "@/shared/domain/errors/conflict-error";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { InMemorySearchableRepository } from "@/shared/domain/repositories/in-memory-searchable.repository";
import { SortDirection } from "@/shared/domain/repositories/searchable-repository-contract";

import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";

export class UserInMemoryRepository extends InMemorySearchableRepository<UserEntity> implements UserRepository.UserRepository {
  sortableFields: string[] = ['name', 'email', 'createdAt'];

  protected async applyFilter(items: UserEntity[], filter: UserRepository.Filter): Promise<UserEntity[]> {
    if(!filter) {
      return items
    }

    return items.filter(item => item.props.name.toLowerCase().includes(filter.toLowerCase()))
  }

  protected async applySort(items: UserEntity[], sort: string | null | undefined, sortDir: SortDirection | null | undefined): Promise<UserEntity[]> {
    if(!sort) {
      return super.applySort(items, 'createdAt', 'desc')
    }

    return super.applySort(items, sort, sortDir)
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this._getByEmail(email);
  }

  async emailExists(email: string): Promise<void> {
    const entity = this.items.find(it => it.email === email)

    if(entity) {
      throw new ConflictError("Email already exists.");
    }
  }

  private async _getByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find(it => it.email === email)

    if(!entity) {
      throw new NotFoundError('Email not found')
    }

    return entity
  }
}
