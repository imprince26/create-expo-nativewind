import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { execSync } from "child_process";
import path from "path";
import fs from "fs-extra";
import os from "os";

describe("CLI Integration Tests", () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = path.join(os.tmpdir(), `expo-nativewind-test-${Date.now()}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    // Clean up test directory
    if (await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
  });

  it("should display help information", () => {
    const result = execSync("node dist/index.js --help", {
      encoding: "utf-8",
      cwd: path.resolve(__dirname, "../../.."),
    });

    expect(result).toContain("create-expo-nativewind");
    expect(result).toContain("--nativewind");
    expect(result).toContain("--npm");
    expect(result).toContain("--yarn");
    expect(result).toContain("--pnpm");
    expect(result).toContain("--bun");
  });

  it("should display version information", () => {
    const result = execSync("node dist/index.js --version", {
      encoding: "utf-8",
      cwd: path.resolve(__dirname, "../../.."),
    });

    expect(result).toMatch(/\d+\.\d+\.\d+/);
  });

  it("should show banner on help command", () => {
    const result = execSync("node dist/index.js --help", {
      encoding: "utf-8",
      cwd: path.resolve(__dirname, "../../.."),
    });

    // Check for text content instead of exact ASCII art
    expect(result).toContain("Build beautiful mobile apps");
    expect(result).toContain("create-expo-nativewind");
    expect(result).toContain("--nativewind");
  });
});
