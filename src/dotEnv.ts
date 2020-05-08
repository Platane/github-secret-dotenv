import fs from "fs";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

export const readEnv = ({
  path = ".env",
  encoding = undefined,
  ...dotEnvOptions
}: dotenv.DotenvParseOptions & { path?: string; encoding?: string } = {}) => {
  const content = fs.readFileSync(path, { encoding });

  const envRaw = dotenv.parse(content, dotEnvOptions);
  const envExpanded = dotenvExpand({
    ignoreProcessEnv: true,
    parsed: envRaw,
  } as any).parsed;

  const env = envExpanded || envRaw;

  return Object.entries(env).map(([name, value]) => ({
    name,
    value: value as string,
  }));
};
