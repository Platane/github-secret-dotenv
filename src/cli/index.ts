import program from "commander";
import { list } from "./commandList";
import { upload } from "./commandUpload";
import { parseOptions } from "./parseOptions";

const repositoryOption = [
  "-r, --repository <slug>",
  "The github repository (<owner>/<repo>)\nIf omitted, read it from the package.json",
] as const;
const githubAccessTokenOption = [
  "-a, --githubAccessToken <token>",
  "Your github access token\nIf omitted, read it from GITHUB_ACCESS_TOKEN env var\nGenerate one from https://github.com/settings/tokens/new\nMust have permissions [public_repo  read:public_key]",
] as const;

const p = program.name("github-secret");

p.command("upload", { isDefault: true })
  .description("Upload secrets to github from your .env file.")
  .option(...repositoryOption)
  .option(...githubAccessTokenOption)
  .option("-e, --dotEnvFilename <filename>", "The .env file to read", ".env")
  .option(
    "-d, --delete",
    "When set, remove all secrets that are not in the .env",
    false
  )
  .action(async (rawOptions) => {
    const {
      owner,
      repo,
      accessToken,
      dotEnvFilename,
      delete: deleteUnListed,
    } = parseOptions(rawOptions);

    if (!owner || !repo) throw new Error("undefined repository");

    if (!accessToken) throw new Error("undefined github access token");

    await upload({
      owner,
      repo,
      accessToken,
      dotEnvFilename: dotEnvFilename!,
      deleteUnListed: deleteUnListed!,
    });
  });

p.command("list")
  .description("List secrets present in the repository.")
  .option(...repositoryOption)
  .option(...githubAccessTokenOption)
  .option(
    "-e, --dotEnvTemplateFilename <filename>",
    "Write secrets names in a .env template file"
  )
  .action(async (rawOptions) => {
    const { owner, repo, accessToken, dotEnvTemplateFilename } = parseOptions(
      rawOptions
    );

    if (!owner || !repo) throw new Error("undefined repository");

    if (!accessToken) throw new Error("undefined github access token");

    await list({
      owner,
      repo,
      accessToken,
      dotEnvTemplateFilename,
    });
  });

program.parse(process.argv);
