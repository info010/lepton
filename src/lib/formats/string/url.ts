import { LeptonError } from "../../errors";
import { LeptonString } from "../../lepton";
import { promises as dns } from "dns";
import net from "net";

export type UrlOptions = {
  //default: ["http:", "https:", "ws:", "wss:", "ftp:"]
  protocols?: string[];
  //default: true
  requireProtocol?: boolean;
  //default: false
  allowRelative?: boolean;
  //default: true
  allowHostWithoutDot?: boolean;
  //default: false
  forbidQuery?: boolean;
  //default: false
  forbidFragment?: boolean;
  //default: false
  checkDns?: boolean;
  //default: "Invalid URL"
  fallBack?: string;
};

function isLikelyRelative(s: string) {
  return s.startsWith("/") || s.startsWith("./") || s.startsWith("../");
}

async function isValidURL(
  url: string,
  {
    protocols = ["http:", "https:", "ws:", "wss:", "ftp:"],
    requireProtocol = true,
    allowRelative = false,
    allowHostWithoutDot = false,
    forbidQuery = false,
    forbidFragment = false,
    checkDns = false,
  }: UrlOptions = {}
): Promise<string | false> {
  if (allowRelative && isLikelyRelative(url)) return url;
  
  const candidate = requireProtocol || url.includes("://") ? url : `http://${url}`;

  const u = new URL(candidate);
  if (u == null || u == undefined) throw LeptonError.create(`Url can't defined: ${candidate}`);

  //Protocols
  if (!protocols.includes(u.protocol)) throw LeptonError.create(`Protocol not allowed: ${u.protocol}`);

  //Required Protocol
  if (requireProtocol && !url.includes("://")) throw LeptonError.create(`Protocol is required`);

  //Host
  const host = u.hostname;
  const isIP = net.isIP(host) !== 0;

  //Dot
  if (!isIP) {
    const hasDot = host.includes(".");
    if (!hasDot && !allowHostWithoutDot) throw LeptonError.create(`Host must contain a dot or be explicitly allowed: ${host}`);
    if (host.endsWith(".") || host.startsWith(".")) throw LeptonError.create(`Host cannot start or end with a dot: ${host}`);
  }

  //Port
  if (u.port) {
    const portNum = parseInt(u.port, 10);
    if (portNum < 1 || portNum > 65535) throw LeptonError.create(`Port must be between 1 and 65535`);
  }

  //Query
  if (forbidQuery && u.search) throw LeptonError.create(`Query parameters are not allowed`);

  //Fragment
  if (forbidFragment && u.hash) throw LeptonError.create(`Fragments are not allowed`);

  // DNS
  if (checkDns) {
    try {
      await dns.lookup(u.hostname);
    } catch {
      throw LeptonError.create(`Unresolvable host: ${u.hostname}`);
    }
  }

  return u.toString();
}

export class LeptonUrl extends LeptonString {
  private _urlOptions: UrlOptions;

  constructor(options?: UrlOptions) {
        super();
        this._urlOptions = options ?? {};
    }

  override parse(input: string): string {
    const urlString = super.parse(input);
    if (!isValidURL(urlString, this._urlOptions)) throw LeptonError.create(this._urlOptions.fallBack ?? "Invalid URL");
    return urlString;
  }
}

export function url(options?: UrlOptions): LeptonUrl {
  return new LeptonUrl(options);
}
