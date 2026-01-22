import chalk from "chalk";
import figlet from "figlet";

export function displayBanner() {
  const title = figlet.textSync("Expo NativeWind", {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  });

  console.log("");
  console.log(chalk.hex("#4F46E5")(title));
  console.log("");
  console.log(
    chalk.dim("  Build beautiful mobile apps with Expo and TailwindCSS")
  );
  console.log("");
  console.log(chalk.dim("  ────────────────────────────────────────────────────"));
  console.log("");
}