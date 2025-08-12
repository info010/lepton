import { lepton } from "../../src";
import { testWrappers } from "../test-utils";

describe("Custom String Validators", () => {
  describe("Email", () => {
    const EmailSchema = lepton.email();

    test("Should validate correct emails", () => {
      expect(EmailSchema.parse("test@example.com")).toBe("test@example.com");
      expect(EmailSchema.parse("user.name+tag@domain.co")).toBe("user.name+tag@domain.co");
    });

    test("Should reject invalid emails", () => {
      // Not a string
      // @ts-ignore
      expect(() => EmailSchema.parse(123)).toThrow();
      expect(() => EmailSchema.parse("plainaddress")).toThrow();
      expect(() => EmailSchema.parse("user@")).toThrow();
      expect(() => EmailSchema.parse("@domain.com")).toThrow();
      expect(() => EmailSchema.parse("user@domain")).toThrow();
    });

    test("Encoding/decoding", () => {
      const encoded = EmailSchema.encode("test@example.com");
      expect(typeof encoded).toBe("string");
      expect(EmailSchema.decode(encoded)).toBe("test@example.com");
    });

    testWrappers(EmailSchema, "test@example.com", "invalid-email");
  });

  describe("URL", () => {
    const UrlSchema = lepton.url();

    test("Should validate correct URLs", () => {
      expect(UrlSchema.parse("https://example.com")).toBe("https://example.com/");
      expect(UrlSchema.parse("http://example.com/path")).toBe("http://example.com/path");
    });

    test("Should reject invalid URLs", () => {
      // Not a string
      // @ts-ignore
      expect(() => UrlSchema.parse(123)).toThrow();
      expect(() => UrlSchema.parse("not-a-url")).toThrow();
      expect(() => UrlSchema.parse("htp:/broken.com")).toThrow();
    });

    test("Encoding/decoding", () => {
      const encoded = UrlSchema.encode("https://example.com");
      expect(typeof encoded).toBe("string");
      expect(UrlSchema.decode(encoded)).toBe("https://example.com/");
    });

    testWrappers(UrlSchema, "https://example.com", "not-a-url");
  });
});
