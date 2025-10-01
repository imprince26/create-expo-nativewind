import chalk from 'chalk';

export function displayBanner() {
  const banner = `
${chalk.cyan('╔═══════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}                                                           ${chalk.cyan('║')}
${chalk.cyan('║')}      ${chalk.bold.white('🎨 Create Expo NativeWind App')}                    ${chalk.cyan('║')}
${chalk.cyan('║')}                                                           ${chalk.cyan('║')}
${chalk.cyan('║')}      ${chalk.gray('Expo + NativeWind (TailwindCSS) = ❤️')}              ${chalk.cyan('║')}
${chalk.cyan('║')}                                                           ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════════════════════════╝')}
  `;
  console.log(banner);
}
