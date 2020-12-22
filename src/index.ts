export * from "./github";

import { createSecretUpdater } from "./github";
import { readEnv } from "./dotEnv";

/**
 * read the content of a .env file and upload the content as github secret
 */
export const readAndUpload = async (options: {
  owner: string;
  repo: string;
  githubAccessToken: string;
  dotEnvFilename: string;
}) => {
  const env = readEnv({ path: options.dotEnvFilename });

  const upload = createSecretUpdater(options);

  await Promise.all(env.map(({ name, value }) => upload(name, value)));
};
