require("dotenv").config();
import { createSecretUploader } from "./github";
import { readEnv } from "./dotEnv";
import program from "commander";
import { readPackageJson } from "./readRepository";

program
  .option("-r <slug>, --repository <slug>", "repository full slug")
  .option("-p <path>, --path <path>", "dot env filename", ".env")
  .option("-a <token>, --githubAccessToken <token>", "github access token");

const parseOptions = options => {
  let owner,
    repo,
    accessToken,
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

  return { owner, repo, accessToken, path };
};

const run = async options => {
  const { owner, repo, accessToken, path } = parseOptions(options);

  if (!owner || !repo) throw new Error("undefined repository");

  if (!accessToken) throw new Error("undefined github access token");

  console.log(`reading ${path}`);

  const env = readEnv({ path });

  console.log(`uploading to ${owner}/${repo}`);

  const upload = createSecretUploader({
    owner,
    repo,
    accessToken
  });

  await Promise.all(
    env.map(({ name, value }) =>
      upload(name, value).then(() => console.log(`- 🆗   ${name}`))
    )
  );
};

run(program.parse(process.argv));
