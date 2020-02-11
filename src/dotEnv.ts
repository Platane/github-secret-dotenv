import fs from "fs";
import dotenv from "dotenv";

export const readEnv = ({
  path = ".env",
  encoding = undefined,
  ...dotEnvOptions
} = {}) => {
  const content = fs.readFileSync(path, { encoding });

  const a = dotenv.parse(content, dotEnvOptions);

  return a;
};
