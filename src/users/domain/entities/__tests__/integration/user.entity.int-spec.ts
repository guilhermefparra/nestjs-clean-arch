import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity, UserProps } from "../../user.entity"
import { EntityValidationError } from "@/shared/domain/errors/validation-error"

describe("UserEntity integration testes", () => {
  describe("Constructor method", () => {
    it("Should throw an error when creating a user with invalid name", () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        name: null as any
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: ''
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: 'a'.repeat(256)
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: 10 as any
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it("Should throw an error when creating a user with invalid email", () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        email: null as any
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        email: ''
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        email: 'a'.repeat(256)
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it("Should throw an error when creating a user with invalid password", () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        password: null as any
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        password: ''
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        password: 'a'.repeat(101)
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it("Should throw an error when creating a user with invalid createdAt", () => {

      let props: UserProps = {
        ...UserDataBuilder({}),
        createdAt: 10 as any
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        createdAt: 'a' as any
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it("Should create a valid user", () => {
      expect.assertions(0)

      const props: UserProps = {
        ...UserDataBuilder({}),
      }

      new UserEntity(props)
    })
  })

  describe("UpdateName method", () => {
    it("Should throw an error when updating a user name with invalid name", () => {
      const entity = new UserEntity(UserDataBuilder({}))

      expect(() => entity.updateName(null as any)).toThrow(EntityValidationError)
      expect(() => entity.updateName('')).toThrow(EntityValidationError)
      expect(() => entity.updateName(10 as any)).toThrow(EntityValidationError)
      expect(() => entity.updateName('a'.repeat(256) as any)).toThrow(EntityValidationError)
    })

    it("Should update user name", () => {
      expect.assertions(0)

      const props: UserProps = {
        ...UserDataBuilder({}),
      }

      const entity = new UserEntity(props)

      entity.updateName("other name")
    })
  })

  describe("UpdatePassword method", () => {
    it("Should throw an error when updating a user password with invalid password", () => {
      const entity = new UserEntity(UserDataBuilder({}))

      expect(() => entity.updatePassword(null as any)).toThrow(EntityValidationError)
      expect(() => entity.updatePassword('')).toThrow(EntityValidationError)
      expect(() => entity.updatePassword(10 as any)).toThrow(EntityValidationError)
      expect(() => entity.updatePassword('a'.repeat(101) as any)).toThrow(EntityValidationError)
    })

    it("Should update user password", () => {
      expect.assertions(0)

      const props: UserProps = {
        ...UserDataBuilder({}),
      }

      const entity = new UserEntity(props)

      entity.updatePassword("other password")
    })
  })
})
