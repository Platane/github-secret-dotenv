import { createSecretUpdater, listSecrets, removeSecret } from "../github";
import chalk from "chalk";
import { readEnv } from "../dotEnv";
import { createPrompt } from "./prompt";

export const upload = async ({
  owner,
  repo,
  accessToken,
  dotEnvFilename,
  deleteUnListed,
}: {
  deleteUnListed: boolean;
  owner: string;
  repo: string;
  accessToken: string;
  dotEnvFilename: string;
}) => {
  console.log(`reading secrets from ${chalk.yellow(dotEnvFilename)}`);

  const env = readEnv({ path: dotEnvFilename });

  console.log(`uploading secrets to ${chalk.yellow(owner + "/" + repo)}`);

  const currentSecrets = deleteUnListed
    ? await listSecrets({ owner, repo, accessToken })
    : [];

  const state: State = {
    items: [
      ...env.map(
        ({ name, value }) =>
          ({ name, value, status: "pending", action: "set" } as const)
      ),

      ...currentSecrets
        .filter((s) => !env.some((e) => e.name === s.name))
        .map(
          ({ name }) => ({ name, status: "pending", action: "remove" } as const)
        ),
    ],
  };

  const p = createPrompt(render(state));

  const upload = createSecretUpdater({
    owner,
    repo,
    accessToken,
  });

  await Promise.all(
    state.items.map(async (i) => {
      try {
        if (i.action === "set") await upload(i.name, i.value);
        if (i.action === "remove")
          await removeSecret({ owner, repo, accessToken }, i.name);

        i.status = "done";
      } catch (error) {
        i.status = "error";
        i.error = error;
      }

      p.update();
    })
  );

  p.dispose();
};

const render = (state: State) => (spinner: string) =>
  state.items
    .map(({ status, action, name, error }) => {
      let statusIcon = "";
      if (status === "done") statusIcon = chalk.green("✔");
      if (status === "pending") statusIcon = chalk.yellow(spinner);
      if (status === "error") statusIcon = chalk.red("×");

      let verb = "";
      if (action === "remove" && status === "done") verb = "removed";
      if (action === "remove" && status === "pending") verb = "removing";
      if (action === "set" && status === "done") verb = "updated";
      if (action === "set" && status === "pending") verb = "";

      return `  ${statusIcon}  ${name}   ${
        error ? "⚠️  " + error.message : chalk.yellow(verb)
      }`;
    })
    .join("\n");

type Item = (
  | {
      action: "set";
      value: string;
    }
  | { action: "remove" }
) & {
  name: string;
  status: "pending" | "done" | "error";
  error?: Error;
};

export type State = {
  items: Item[];
};
