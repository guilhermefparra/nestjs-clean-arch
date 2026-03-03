import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserInMemoryRepository } from "../../user-in-memory.repository";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { ConflictError } from "@/shared/domain/errors/conflict-error";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe("UserInMemoryRepository unit tests", () => {
  let sut: UserInMemoryRepository
  let entity: UserEntity;

  beforeEach(async () => {
    sut = new UserInMemoryRepository()
    entity = new UserEntity({
      name: 'test', email: 'test@example.com', password: 'password'
    })
    await sut.insert(entity);
  })

  it("Should inserts a new entity", async () => {
    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it("Should throw error when entity not found - findByEmail mehtod", async () => {
    await expect(sut.findByEmail('fakeId')).rejects.toThrow(new NotFoundError("Email not found"))
  })

  it("Should find a entity by email", async () => {
    const result = await sut.findByEmail(entity.email)
    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it("Should throw error when email already exists - emailExists method", async () => {
    await expect(sut.emailExists(entity.email)).rejects.toThrow(new ConflictError("Email already exists."))
  })

  it("Should throw error when email already exists - emailExists method", async () => {
    expect.assertions(0)

    await sut.emailExists('test2@example.com')
  })

  it("Should no filter items", async () => {
    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')
    const itemsFiltered = await sut['applyFilter'](result, null as any)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(result)
  })

  it("Should filter name filed using filter params", async () => {
    const items = [
      new UserEntity(UserDataBuilder({
        name: 'Test',
      })),
      new UserEntity(UserDataBuilder({
        name: 'jose',
      }))
    ]
  const spyFilter = jest.spyOn(items, 'filter')
  const itemsFiltered = await sut['applyFilter'](items,'TEST')
  expect(spyFilter).toHaveBeenCalled()
  expect(itemsFiltered).toStrictEqual([items[0]])
  })

  it("Should sort items by createdAt desc when sort param is null", async () => {
    const items = [
      new UserEntity(UserDataBuilder({
        name: 'Test',
        createdAt: new Date(2020, 1, 1)
      })),
      new UserEntity(UserDataBuilder({
        name: 'jose',
        createdAt: new Date(2022, 1, 1)
      })),
      new UserEntity(UserDataBuilder({
        name: 'maria',
        createdAt: new Date(2021, 1, 1)
      }))
    ]
    const spySort = jest.spyOn(items, 'toSorted')
    const itemsSorted = await sut['applySort'](items, null, null)
    expect(spySort).toHaveBeenCalled()
    expect(itemsSorted).toStrictEqual([items[1], items[2], items[0]])
  })

  it("Should sort items by name asc", async () => {
    const items = [
      new UserEntity(UserDataBuilder({
        name: 'Test',
      })),
      new UserEntity(UserDataBuilder({
        name: 'jose',
      })),
      new UserEntity(UserDataBuilder({
        name: 'maria',
      }))
    ]
    const spySort = jest.spyOn(items, 'toSorted')
    const itemsSorted = await sut['applySort'](items, 'name', 'asc')
    expect(spySort).toHaveBeenCalled()
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]])
  })

  it("Should sort items by name desc", async () => {
    const items = [
      new UserEntity(UserDataBuilder({
        name: 'Test',
      })),
      new UserEntity(UserDataBuilder({
        name: 'jose',
      })),
      new UserEntity(UserDataBuilder({
        name: 'maria',
      }))
    ]
    const spySort = jest.spyOn(items, 'toSorted')
    const itemsSorted = await sut['applySort'](items, 'name', 'desc')
    expect(spySort).toHaveBeenCalled()
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })
})
