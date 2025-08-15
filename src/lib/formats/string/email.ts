import { LeptonError } from "../../errors";
import { LeptonString } from "../../lepton";
import { promises as dns } from "dns";

export type EmailOptions = {
  //default: false
  checkDns?: boolean;
  //default: []
  allowedTlds?: string[];
  //default: []
  allowedDomains?: string[];
  //default: "Invalid Email"
  fallBack?: string;
};

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

async function isValidEmail(
  email: string,
  { checkDns = false, allowedTlds, allowedDomains }: EmailOptions = {}
): Promise<string | false> {
  if (!emailRegex.test(email)) {
    return false;
  }

  const [name , domain] = email.split("@");

  if (!name || name == undefined || !domain || domain == undefined) throw LeptonError.create(`Invalid email.`)
  
  //Domain
  if (allowedDomains && !allowedDomains.includes(domain)) throw LeptonError.create(`Email domain not allowed: ${domain}`);

  //TLD
  if (allowedTlds) {
    const tld = domain.split(".").pop();
    if (!tld || !allowedTlds.includes(tld)) throw LeptonError.create(`TLD not allowed: ${tld}`);
  }

  //DNS
  if (checkDns) {
    try {
      const mx = await dns.resolveMx(domain).catch(() => []);
      if (mx.length === 0) await dns.lookup(domain);
    } catch {
      throw LeptonError.create(`Unresolvable email domain: ${domain}`);
    }
  }

  return email;
}


export class LeptonUrl extends LeptonString {
  private _urlOptions: EmailOptions;

  constructor(options?: EmailOptions) {
        super();
        this._urlOptions = options ?? {};
    }

  override parse(input: string): string {
    const urlString = super.parse(input);
    if (!isValidEmail(urlString, this._urlOptions)) throw LeptonError.create(this._urlOptions.fallBack ?? "Invalid URL");
    return urlString;
  }
}

export function url(options?: EmailOptions): LeptonUrl {
  return new LeptonUrl(options);
}
