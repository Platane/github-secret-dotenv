import fs from "fs";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import type { ObjectEncodingOptions } from "fs";

export const readEnv = ({
  path = ".env",
  encoding = undefined,
  ...dotEnvOptions
}: dotenv.DotenvParseOptions & {
  path?: string;
  encoding?: ObjectEncodingOptions["encoding"];
} = {}) => {
  const content = fs.readFileSync(path, { encoding });

  const envRaw = dotenv.parse(content, dotEnvOptions);
  const envExpanded = dotenvExpand({
    parsed: envRaw,

    // workaround until dotenv-expand fixes its typedef https://github.com/motdotla/dotenv-expand/pull/38
    ...({ ignoreProcessEnv: true } as any),
  }).parsed;

  const env = envExpanded || envRaw;

  return Object.entries(env).map(([name, value]) => ({
    name,
    value: value as string,
  }));
};
