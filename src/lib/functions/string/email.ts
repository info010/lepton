import { LeptonError } from "../../errors";
import { LeptonType } from "../../types";
import { LeptonOptional, LeptonArray, LeptonNullable } from "../../lepton";

export class LeptonEmail extends LeptonType<string, string> {
    constructor() {
        super();
    }

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    parse(input: string): string {
        if (!this.isValidEmail(input)) {
            throw new LeptonError(`Invalid email: ${input}`);
        }
        return input;
    }

    encode(value: string): string {
        if (!this.isValidEmail(value)) {
            throw new LeptonError(`Invalid email: ${value}`);
        }
        return value;
    }

    _rawDecode(value: string): [string, string] {
        if (!this.isValidEmail(value)) {
            throw new LeptonError(`Invalid email: ${value}`);
        }
        return [value, value];
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

export function email(): LeptonEmail {
    return new LeptonEmail();
}