import { HashProvider } from "@/shared/application/providers/hash-provider";
import { compare, hash } from "bcryptjs";

export class BcryptjsHashProvider implements HashProvider {
  HASH_SALT = 10;

  async generateHash(value: string): Promise<string> {
    return hash(value, this.HASH_SALT);
  }

  async compareHash(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue);
  }
}
