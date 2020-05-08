require("dotenv").config();
import { createSecretUpdater, listSecrets, removeSecret } from "./github";
import { readEnv } from "./dotEnv";
import program from "commander";
import { readPackageJson } from "./readRepository";
import chalk from "chalk";
import { createPrompt, State } from "./prompt";

program
  .name("github-secret")
  .description("Upload secrets to github from your .env file.")

  .option(
    "-r, --repository <slug>",
    "The github repository (<owner>/<repo>)\nIf omitted, read it from the package.json"
  )
  .option("-e, --dotEnvFilename <filename>", "The .env file to read", ".env")
  .option(
    "-a, --githubAccessToken <token>",
    "Your github access token\nIf omitted, read it from GITHUB_ACCESS_TOKEN env var\nGenerate one from https://github.com/settings/tokens/new\nMust have permissions [public_repo  read:public_key]"
  )
  .option(
    "-d, --delete",
    "When set, remove all secrets that are not in the .env",
    false
  );

const parseOptions = (options: {
  githubAccessToken?: string;
  repository?: string;
  dotEnvFilename?: string;
  delete?: boolean;
}) => {
  let owner: string | undefined,
    repo: string | undefined,
    accessToken = options.githubAccessToken;

  if (!accessToken && process.env.GITHUB_ACCESS_TOKEN) {
    accessToken = process.env.GITHUB_ACCESS_TOKEN;
  }

  if (options.repository) {
    owner = options.repository.split("/")[0];
    repo = options.repository.split("/")[1];
  }

  if (!repo) {
    const m = readPackageJson();

    if (m) {
      owner = m.owner;
      repo = m.repo;
    }
  }

  return {
    owner,
    repo,
    accessToken,
    dotEnvFilename: options.dotEnvFilename,
    delete: options.delete,
  };
};

const upload = async (options: any) => {
  const { owner, repo, accessToken, dotEnvFilename, ...o } = parseOptions(
    options
  );

  if (!owner || !repo) throw new Error("undefined repository");

  if (!accessToken) throw new Error("undefined github access token");

  console.log(`reading secrets from ${chalk.yellow(dotEnvFilename)}`);

  const env = readEnv({ path: dotEnvFilename });

  console.log(`uploading secrets to ${chalk.yellow(owner + "/" + repo)}`);

  const currentSecrets = o.delete
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

  const p = createPrompt();
  p.update(state);

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

      p.update(state);
    })
  );

  p.dispose();
};

upload(program.parse(process.argv));
