import fs from "fs";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

export const readEnv = ({
  path = ".env",
  encoding = undefined,
  ...dotEnvOptions
} = {}) => {
  const content = fs.readFileSync(path, { encoding });

  const envRaw = dotenv.parse(content, dotEnvOptions);
  const env: any = dotenvExpand({ ignoreProcessEnv: true, parsed: envRaw } as any).parsed;

  return Object.entries(env).map(([name, value]) => ({ name, value }));
};
