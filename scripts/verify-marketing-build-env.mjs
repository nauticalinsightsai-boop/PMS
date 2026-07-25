import { pathToFileURL } from 'node:url';

export const REQUIRED_PUBLIC_MARKETING_BUILD_VARIABLES = Object.freeze([
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_META_PIXEL_ID',
]);

export function getMissingPublicMarketingBuildVariables(env = process.env) {
  return REQUIRED_PUBLIC_MARKETING_BUILD_VARIABLES.filter(
    (name) => typeof env[name] !== 'string' || env[name].trim().length === 0,
  );
}

export function verifyPublicMarketingBuildVariables(env = process.env) {
  const missing = getMissingPublicMarketingBuildVariables(env);
  if (missing.length > 0) {
    throw new Error(
      `Missing required public marketing build variable(s): ${missing.join(', ')}`,
    );
  }
}

function isDirectExecution() {
  return Boolean(
    process.argv[1] &&
      import.meta.url === pathToFileURL(process.argv[1]).href,
  );
}

if (isDirectExecution()) {
  try {
    verifyPublicMarketingBuildVariables();
    console.info('Required public marketing build variables are configured.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Marketing build environment is invalid.');
    process.exitCode = 1;
  }
}
