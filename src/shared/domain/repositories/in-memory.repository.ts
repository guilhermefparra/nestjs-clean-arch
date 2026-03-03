import { Entity } from "../entities/entity";
import { NotFoundError } from "../errors/not-found-error";
import { RepositoryInterface } from "./repository-contract";

export abstract class InMemoryRepository<E extends Entity> implements RepositoryInterface<E> {
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string): Promise<E> {
    return this._get(id)
  }

  async findAll(): Promise<E[]> {
    return this.items
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id)
    const index = await this._getIndex(entity.id)

    this.items[index] = entity
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    const index = await this._getIndex(id)

    this.items.splice(index, 1);
  }

  private async _get(id: string): Promise<E> {
    const _id = `${id}`
    const entity = this.items.find(it => it.id === _id)

    if(!entity) {
      throw new NotFoundError('Entity not found')
    }

    return entity
  }

  private async _getIndex(id: string): Promise<number> {
    return this.items.findIndex(it => it.id === id)
  }
}
