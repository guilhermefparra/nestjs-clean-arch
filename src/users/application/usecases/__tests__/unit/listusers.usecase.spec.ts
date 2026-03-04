import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";

import { UserRepository } from "@/users/domain/repositories/user.repository";
import { ListUsersUseCase } from "../../listusers.usecase";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";


describe("ListUsersUseCase unit tests", () => {
  let sut: ListUsersUseCase.UseCase;
  let userRepository: UserInMemoryRepository;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    sut = new ListUsersUseCase.UseCase(userRepository);
  })

  it("toOutput method", async () => {
    let result = new UserRepository.SearchResult({
      items: [] as any,
      total: 1,
      currentPage: 1,
      perPage: 10,
      sort: '',
      sortDir: 'asc',
      filter: 'fake'
    });

    let output = sut["toOutput"](result);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 10,
      lastPage: 1
    });

    const entity = new UserEntity(UserDataBuilder({}));
    userRepository.items.push(entity);
    result = new UserRepository.SearchResult({
      items: [entity] as any,
      total: 1,
      currentPage: 1,
      perPage: 10,
      sort: '',
      sortDir: 'asc',
      filter: 'fake'
    });

    output = sut["toOutput"](result);

    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      perPage: 10,
      lastPage: 1
    });
  });

  it("should return the user ordered by creation date", async () => {
    const createdAt = new Date();
    const entity = new UserEntity(UserDataBuilder({createdAt}));
    const entityTwo = new UserEntity(UserDataBuilder({createdAt: new Date(createdAt.getTime() + 100)}));

    userRepository.insert(entity);
    userRepository.insert(entityTwo);

    const output = sut.execute({})

    expect(output).resolves.toStrictEqual({
      items: [entityTwo.toJSON(), entity.toJSON()],
      total: 2,
      currentPage: 1,
      perPage: 15,
      lastPage: 1
    });
  });

  it("should return the user using pagination, sort and filter", async () => {
    const entity = new UserEntity(UserDataBuilder({name: 'a'}));
    const entityTwo = new UserEntity(UserDataBuilder({name: 'b'}));
    const entityThree = new UserEntity(UserDataBuilder({name: 'Aa'}));
    const entityFour = new UserEntity(UserDataBuilder({name: 'AaA'}));

    userRepository.insert(entity);
    userRepository.insert(entityTwo);
    userRepository.insert(entityThree);
    userRepository.insert(entityFour);

    let output = sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a'
    })

    expect(output).resolves.toStrictEqual({
      items: [entity.toJSON(), entityFour.toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2
    });

    output = sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a'
    })

    expect(output).resolves.toStrictEqual({
      items: [entityThree.toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2
    });
  });
})

