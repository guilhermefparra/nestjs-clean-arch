import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { GetUserUseCase } from "../../getuser.usecase";
import { UserEntity } from "@/users/domain/entities/user.entity";


describe("GetUserUseCase unit tests", () => {
  let sut: GetUserUseCase.UseCase;
  let userRepository: UserInMemoryRepository;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    sut = new GetUserUseCase.UseCase(userRepository);
  })

  it("Should throw an error when user is not found", async () => {
    await expect(sut.execute({ id: "non-existent-id" })).rejects.toThrow("Entity not found");
  })

  it("Should be able to get user profile", async () => {
    const spyFindById = jest.spyOn(userRepository, "findById");
    const props = UserDataBuilder({});
    const entity = new UserEntity(props);
    await userRepository.insert(entity);
    const result = await sut.execute({ id: entity.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(entity.id);
    expect(result.name).toBe(props.name);
    expect(result.email).toBe(props.email);
    expect(result.password).toBe(props.password);
    expect(result.createdAt).toBe(entity.createdAt);
  })
})

