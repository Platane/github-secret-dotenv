import { createSecretUpdater } from "./github";
import { readEnv } from "./dotEnv";

export const readAndUpload = async options => {
  const env = readEnv(options);

  const upload = createSecretUpdater(options);

  await Promise.all(env.map(({ name, value }) => upload(name, value)));
};
