import { LeptonError } from "../../errors";
import { LeptonString } from "../../lepton";

export class LeptonUrl extends LeptonString {
  override parse(input: string): string {
    if (typeof input !== "string")
      throw LeptonError.create(`Expected string, got ${typeof input}`);
    try {
      const url = new URL(input);
      return url.toString();
    } catch {
      throw LeptonError.create(`Invalid URL: ${input}`);
    }
  }
}

export function url(): LeptonUrl {
  return new LeptonUrl();
}
