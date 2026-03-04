import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { SignUpUseCase } from "../../signup.usecase";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe("SignupUseCase unit tests", () => {
  let sut: SignUpUseCase.UseCase;
  let userRepository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SignUpUseCase.UseCase(userRepository, hashProvider);
  })

  it("Should create a user", async () => {
    const spyInsert = jest.spyOn(userRepository, "insert");
    const props = UserDataBuilder({})
    const result = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password
    });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(result.id).toBeDefined();
    expect(result.name).toBe(props.name);
    expect(result.email).toBe(props.email);
    expect(result.password).not.toBe(props.password);
    expect(result.createdAt).toBeInstanceOf(Date);
  })

  it("Should not create a user with missing fields", async () => {
    await expect(sut.execute({
      name: "",
      email: "",
      password: ""
    })).rejects.toThrow("Missing required fields");

    await expect(sut.execute({
      name: null as any,
      email: null as any,
      password: null as any,
    })).rejects.toThrow("Missing required fields");

    await expect(sut.execute({
      name: undefined as any,
      email: undefined as any,
      password: undefined as any
    })).rejects.toThrow("Missing required fields");

    await expect(sut.execute({
      name: "a",
      email: "",
      password: ""
    })).rejects.toThrow("Missing required fields");

    await expect(sut.execute({
      name: "",
      email: "b",
      password: ""
    })).rejects.toThrow("Missing required fields");

    await expect(sut.execute({
      name: "",
      email: "",
      password: "c"
    })).rejects.toThrow("Missing required fields");

    await expect(sut.execute({
      name: "a",
      email: "b",
      password: ""
    })).rejects.toThrow("Missing required fields");

    await expect(sut.execute({
      name: "",
      email: "b",
      password: "c"
    })).rejects.toThrow("Missing required fields");

    await expect(sut.execute({
      name: "a",
      email: "",
      password: "c"
    })).rejects.toThrow("Missing required fields");
  })

  it("Should not create a user with an existing email", async () => {
    const props = UserDataBuilder({})
    await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password
    });
    await expect(sut.execute({
      name: props.name,
      email: props.email,
      password: props.password
    })).rejects.toThrow("Email already exists");
  })
})

