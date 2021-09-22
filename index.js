const _ = require('lodash');
const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');

async function main() {
  const filePath = path.join(process.cwd(), 'app.yaml');
  let appConfig = (await fs.readFile(filePath)).toString();
  const enVarsInput = core.getInput('environment_variables');
  console.log(enVarsInput);
  const envVarPairs = _.compact(enVarsInput.split('\n')).map((line) => {
    const parts = line.split(':');
    return [parts[0].trim(), parts.slice(1).join(':').trim()];
  });
  console.log(envVarPairs);
  appConfig +=
    '\n' +
    [
      'env_variables:',
      ...envVarPairs.map(([key, value]) => `  ${key}: "${value}"`),
    ].join('\n');
  console.log(appConfig);
  await fs.writeFile(filePath, appConfig);
}
main().catch((error) => {
  core.setFailed(error.message);
});
