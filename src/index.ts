import { createSecretUpdater } from "./github";
import { readEnv } from "./dotEnv";

export const readAndUpload = async (
  options: {
    owner: string;
    repo: string;
    accessToken: string;
  } & Parameters<typeof readEnv>[0]
) => {
  const env = readEnv(options);

  const upload = createSecretUpdater(options);

  await Promise.all(env.map(({ name, value }) => upload(name, value)));
};
