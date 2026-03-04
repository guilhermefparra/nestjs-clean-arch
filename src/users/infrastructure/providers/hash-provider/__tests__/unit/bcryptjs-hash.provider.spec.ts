import { BcryptjsHashProvider } from "../../bcryptjs-hash.provider";

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });

  it('should generate a hash for a given value', async () => {
    const value = 'myPassword';
    const hashedValue = await sut.generateHash(value);

    expect(hashedValue).toBeDefined();
    expect(hashedValue).not.toBe(value);
  });

  it('should compare a value with its hashed version and return true', async () => {
    const value = 'myPassword';
    const hashedValue = await sut.generateHash(value);

    const isMatch = await sut.compareHash(value, hashedValue);
    expect(isMatch).toBeTruthy();
  });

  it('should compare a value with a different hashed version and return false', async () => {
    const value = 'myPassword';
    const differentValue = 'differentPassword';
    const hashedValue = await sut.generateHash(value);

    const isMatch = await sut.compareHash(differentValue, hashedValue);
    expect(isMatch).toBeFalsy();
  });
});
