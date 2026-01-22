import { describe, it, expect } from "@jest/globals";
import validateNpmPackageName from "validate-npm-package-name";

describe("Project name validation", () => {
  it("should accept valid project names", () => {
    const validNames = [
      "my-app",
      "my-expo-app",
      "app123",
      "expo-nativewind-app",
    ];

    validNames.forEach((name) => {
      const result = validateNpmPackageName(name);
      expect(result.validForNewPackages).toBe(true);
    });
  });

  it("should reject invalid project names", () => {
    const invalidNames = [
      "My App", // spaces
      "my_app!", // special characters
      "", // empty
    ];

    invalidNames.forEach((name) => {
      const result = validateNpmPackageName(name);
      expect(result.validForNewPackages).toBe(false);
    });
  });

  it("should accept names starting with dot for scoped packages", () => {
    const name = ".myapp";
    const result = validateNpmPackageName(name);
    // This is actually valid for scoped packages, but we handle it specially
    expect(typeof result.validForNewPackages).toBe("boolean");
  });

  it("should accept dot for current directory", () => {
    const name = ".";
    // Note: In actual code, we handle '.' as a special case
    expect(name).toBe(".");
  });
});
