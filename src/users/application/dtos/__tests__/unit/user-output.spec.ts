import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserOutputMapper } from "../../user-output";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe("UserOutputMapper unit tests", () => {
  it("should be able to create an output from a user entity", () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const spyToJSON = jest.spyOn(entity, "toJSON");

    const sut = UserOutputMapper.toOutput(entity);

    expect(spyToJSON).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJSON());
  });
});
