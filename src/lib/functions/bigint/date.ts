import { LeptonError } from "../../errors";
import { LeptonType } from "../../types";
import { LeptonOptional, LeptonNullable, LeptonArray, bigint } from "../../lepton";

export class LeptonDate extends LeptonType<bigint, Date> {
    constructor() {
        super();
    }

    parse(value: bigint): Date {
        try {
            return new Date(Number(value));
        } catch {
            throw new LeptonError(`Invalid Date: ${value}`);
        }
    }

    encode(value: Date): string {
        return BigInt(value.getTime()).toString();
    }

    _rawDecode(bytes: string): [Date, string] {
        const value = Number(BigInt(bytes));
        return [new Date(value), bytes];
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

export function date(): LeptonDate {
    return new LeptonDate();
}