import { LeptonError } from "../../errors";
import { LeptonType } from "../../types";
import { LeptonOptional, LeptonArray, LeptonNullable } from "../../lepton";

export class LeptonUrl extends LeptonType<string, URL> {
    constructor() {
        super();
    }

    parse(input: string): URL {
        try {
            const url = new URL(input);
            return url;
        } catch {
            throw new LeptonError(`Invalid URL: ${input}`);
        }
    }

    encode(value: URL): string {
        return value.toString();
    }

    _rawDecode(value: string): [URL, string] {
        return [this.parse(value), value];
    }

    optional(): LeptonOptional<this> {
        return new LeptonOptional(this);
    }

    nullable(): LeptonNullable<this> {
        return new LeptonNullable(this);
    }

    array(): LeptonArray<this> {
        return new LeptonArray(this);
    }
}

export function url(): LeptonUrl {
	return new LeptonUrl();
}