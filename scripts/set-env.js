import { writeFileSync } from 'fs';

const targetPath = './src/environments/environment.ts';

const envConfigFile = `
export const environment = {
  production: true,
  publicApiKey: '${process.env['SECRET_API_KEY'] || ''}'
};
`;

writeFileSync(targetPath, envConfigFile);
console.log(process.env['SECRET_API_KEY']);
console.log('✅ Environment variables written to environment.ts');
