import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { detectPackageManager } from "../../../src/utils/packageManager";

describe("packageManager", () => {
  beforeEach(() => {
    // Clear environment variables before each test
    delete process.env.npm_config_user_agent;
    delete process.env._;
  });

  describe("detectPackageManager", () => {
    it("should return npm when --npm flag is provided", () => {
      const result = detectPackageManager({ npm: true });
      expect(result).toBe("npm");
    });

    it("should return yarn when --yarn flag is provided", () => {
      const result = detectPackageManager({ yarn: true });
      expect(result).toBe("yarn");
    });

    it("should return pnpm when --pnpm flag is provided", () => {
      const result = detectPackageManager({ pnpm: true });
      expect(result).toBe("pnpm");
    });

    it("should return bun when --bun flag is provided", () => {
      const result = detectPackageManager({ bun: true });
      expect(result).toBe("bun");
    });

    it("should detect bun from npm_config_user_agent", () => {
      process.env.npm_config_user_agent = "bun/1.0.0";
      const result = detectPackageManager({});
      expect(result).toBe("bun");
    });

    it("should detect yarn from npm_config_user_agent", () => {
      process.env.npm_config_user_agent = "yarn/1.22.0";
      const result = detectPackageManager({});
      expect(result).toBe("yarn");
    });

    it("should detect pnpm from npm_config_user_agent", () => {
      process.env.npm_config_user_agent = "pnpm/8.0.0";
      const result = detectPackageManager({});
      expect(result).toBe("pnpm");
    });

    it("should detect npm from npm_config_user_agent", () => {
      process.env.npm_config_user_agent = "npm/9.0.0";
      const result = detectPackageManager({});
      expect(result).toBe("npm");
    });

    it("should default to npm when no detection method works", () => {
      const result = detectPackageManager({});
      expect(result).toBe("npm");
    });

    it("should prioritize explicit flags over environment detection", () => {
      process.env.npm_config_user_agent = "yarn/1.22.0";
      const result = detectPackageManager({ pnpm: true });
      expect(result).toBe("pnpm");
    });
  });
});
