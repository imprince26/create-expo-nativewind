import chalk from 'chalk';
import { PackageManager } from './packageManager';

export function displaySuccess(projectName: string, packageManager: PackageManager, withNativeWind: boolean) {
  const commands: Record<PackageManager, string> = {
    npm: 'npm start',
    yarn: 'yarn start',
    pnpm: 'pnpm start',
  };

  console.log(chalk.green('\n✔ Success! Your Expo app is ready.\n'));
  
  console.log(chalk.cyan('Next steps:\n'));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white(`  ${commands[packageManager]}\n`));

  if (withNativeWind) {
    console.log(chalk.yellow('📱 NativeWind is configured and ready to use!'));
    console.log(chalk.gray('   Use Tailwind classes in your components:\n'));
    console.log(chalk.gray('   <View className="flex-1 bg-blue-500">'));
    console.log(chalk.gray('     <Text className="text-white text-xl">Hello!</Text>'));
    console.log(chalk.gray('   </View>\n'));
  }

  console.log(chalk.cyan('📚 Useful resources:'));
  console.log(chalk.gray(`   Expo docs: ${chalk.underline('https://docs.expo.dev')}`));
  
  if (withNativeWind) {
    console.log(chalk.gray(`   NativeWind docs: ${chalk.underline('https://www.nativewind.dev')}`));
  }
  
  console.log(chalk.green('\n🚀 Happy coding!\n'));
}
