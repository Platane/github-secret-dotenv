require("dotenv").config();
import { createSecretUpdater, listSecrets, removeSecret } from "./github";
import { readEnv } from "./dotEnv";
import program from "commander";
import { readPackageJson } from "./readRepository";
import chalk from "chalk";

program
  .name("github-secret")
  .description("Upload secrets in github from your .env file.")
  .option("-r, --repository <slug>", "repository full slug")
  .option("-p, --path <path>", "dot env filename", ".env")
  .option("-a, --githubAccessToken <token>", "github access token")
  .option("-d, --delete", "remove from github secrets not in .env", false);

const parseOptions = options => {
  let owner,
    repo,
    accessToken,
    delete_ = false,
    path = ".env";

  if (process.env.GITHUB_ACCESS_TOKEN) {
    accessToken = process.env.GITHUB_ACCESS_TOKEN;
  }

  if (options.githubAccessToken) {
    accessToken = options.githubAccessToken;
  }

  if (options.path) {
    path = options.path;
  }

  if (options.delete) {
    delete_ = !!options.delete;
  }

  if (options.repository) {
    owner = options.repository.slit("/")[0];
    repo = options.repository.slit("/")[1];
  }

  if (!repo) {
    const m = readPackageJson();

    if (m) {
      owner = m.owner;
      repo = m.repo;
    }
  }

  return { owner, repo, accessToken, path, delete: delete_ };
};

const upload = async options => {
  const { owner, repo, accessToken, path, ...o } = parseOptions(options);

  if (!owner || !repo) throw new Error("undefined repository");

  if (!accessToken) throw new Error("undefined github access token");

  console.log(`reading secrets from ${chalk.yellow(path)}`);

  const env = readEnv({ path });

  console.log(`uploading secrets to ${chalk.yellow(owner + "/" + repo)}`);

  const upload = createSecretUpdater({
    owner,
    repo,
    accessToken
  });

  await Promise.all(
    env.map(({ name, value }) =>
      upload(name, value).then(() => console.log(`  ✔   ${name} updated`))
    )
  );

  if (o.delete) {
    console.log("");

    const secrets = await listSecrets({ owner, repo, accessToken });

    await Promise.all(
      secrets
        .filter(s => !env.some(e => e.name === s.name))
        .map(s =>
          removeSecret({ owner, repo, accessToken }, s.name).then(() =>
            console.log(`  ✔   ${s.name} removed`)
          )
        )
    );
  }
};

upload(program.parse(process.argv));
