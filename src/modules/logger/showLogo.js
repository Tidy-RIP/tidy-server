import figlet from 'figlet';
import chalk from 'chalk';

export const showLogo = () => {
  if (process.env.NODE_ENV !== 'production') {
    const logoText = figlet.textSync('Tidy', {
      font: 'Standard',
      horizontalLayout: 'full',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    });

    // Usar chalk para colorear el texto
    const coloredLogoText = chalk.hex('#800080').bold(logoText);

    // Mostrar el logo en la consola
    console.log(coloredLogoText);
  }
};
