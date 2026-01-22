import { describe, it, expect } from "@jest/globals";
import chalk from "chalk";

describe("CLI Output Formatting", () => {
  it("should format success messages", () => {
    const message = chalk.green("Success! Your Expo app is ready");
    expect(message).toContain("Success");
  });

  it("should format error messages", () => {
    const message = chalk.red("Error: Failed to create project");
    expect(message).toContain("Error");
  });

  it("should format info messages", () => {
    const message = chalk.dim("Configuration loaded");
    expect(message).toContain("Configuration");
  });

  it("should format bold messages", () => {
    const message = chalk.bold("Creating Expo project...");
    expect(message).toContain("Creating");
  });

  it("should format hex color messages", () => {
    const message = chalk.hex("#4F46E5")("Expo NativeWind");
    expect(message).toContain("Expo NativeWind");
  });
});
