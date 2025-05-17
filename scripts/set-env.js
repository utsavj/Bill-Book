import { writeFileSync } from 'fs';

const targetPath = './src/environments/environment.ts';

const envConfigFile = `
export const environment = {
  production: true,
  publicApiKey: '${process.env['SECRET_API_KEY'] || ''}'
  spreadsheetId: '${process.env['SPREADSHEET_ID'] || ''}',
};
`;

writeFileSync(targetPath, envConfigFile);
console.log('✅ Environment variables written to environment.ts');
