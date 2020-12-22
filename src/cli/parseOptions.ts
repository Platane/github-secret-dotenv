require("dotenv").config();
import { readPackageJson } from "../readPackageJson";

export const parseOptions = (options: {
  githubAccessToken?: string;
  repository?: string;
  dotEnvFilename?: string;
  dotEnvTemplateFilename?: string;
  delete?: boolean;
}) => {
  let owner: string | undefined;
  let repo: string | undefined;
  let githubAccessToken =
    options.githubAccessToken || process.env.GITHUB_ACCESS_TOKEN;

  if (options.repository) {
    [owner, repo] = options.repository.split("/");
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
    githubAccessToken,
    dotEnvFilename: options.dotEnvFilename,
    dotEnvTemplateFilename: options.dotEnvTemplateFilename,
    delete: options.delete,
  };
};
