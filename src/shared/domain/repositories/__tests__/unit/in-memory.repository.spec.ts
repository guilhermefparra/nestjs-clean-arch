import { Entity } from "@/shared/domain/entities/entity";
import { InMemoryRepository } from "../../in-memory.repository";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("InMemoryRepository unit tests", () => {
  let sut: StubInMemoryRepository
  let entity: StubEntity;

  beforeEach(async () => {
    sut = new StubInMemoryRepository()
    entity = new StubEntity({
      name: 'test', price: 50
    })
    await sut.insert(entity);
  })

  it("Should inserts a new entity", async () => {
    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it("Should throw error when entity not found", async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(new NotFoundError("Entity not found"))
  })

  it("Should find a entity by id", async () => {
    const result = await sut.findById(entity.id)
    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it("Should return all entities", async () => {
    const result = await sut.findAll()
    expect(result.length).toBe(1)
    expect([entity]).toStrictEqual(result)
  })

  it("Should throw error on update when entity not found", async () => {
    const fakeEntity = new StubEntity({name: 'fake', price: 100})
    await expect(sut.update(fakeEntity)).rejects.toThrow(new NotFoundError("Entity not found"))
  })

  it("Should update an entity", async () => {
    const entityUpdated = new StubEntity({name: 'updated', price: 100}, entity._id)
    await sut.update(entityUpdated)
    expect(entityUpdated.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it("Should throw error on delete when entity not found", async () => {
    await expect(sut.delete("fake")).rejects.toThrow(new NotFoundError("Entity not found"))
  })

  it("Should delete an entity", async () => {
    await sut.delete(entity.id)
    expect(sut.items).toHaveLength(0)
  })
})
