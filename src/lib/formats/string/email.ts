import { LeptonError } from "../../errors";
import { LeptonString } from "../../lepton";

export class LeptonEmail extends LeptonString {
  override parse(input: string): string {
    if (typeof input !== "string")
      throw LeptonError.create(`Expected string, got ${typeof input}`);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(input))
      throw LeptonError.create(`Invalid email format: ${input}`);

    return input;
  }
}

export function email(): LeptonEmail {
  return new LeptonEmail();
}
