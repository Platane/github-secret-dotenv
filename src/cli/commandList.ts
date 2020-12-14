import * as fs from "fs";
import dotenv from "dotenv";
import chalk from "chalk";
import { listSecrets } from "../github";

export const list = async ({
  owner,
  repo,
  accessToken,
  dotEnvTemplateFilename,
}: {
  owner: string;
  repo: string;
  accessToken: string;
  dotEnvTemplateFilename?: string;
}) => {
  console.log(`reading secrets from ${chalk.yellow(owner + "/" + repo)}`);

  const secrets = await listSecrets({ owner, repo, accessToken });

  console.log(secrets.map(({ name }) => name).join("\n"));

  if (dotEnvTemplateFilename) {
    let originalEnvContent = "";

    try {
      originalEnvContent = fs.readFileSync(dotEnvTemplateFilename).toString();
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }

    const originalEnv = dotenv.parse(originalEnvContent);

    const content =
      originalEnvContent +
      "\n" +
      secrets
        .filter(({ name }) => !originalEnv[name])
        .map(({ name }) => `${name}=`)
        .join("\n");

    fs.writeFileSync(dotEnvTemplateFilename, content);

    console.log(`template written to ${chalk.yellow(dotEnvTemplateFilename)}`);
  }
};
