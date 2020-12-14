require("dotenv").config();
import { readPackageJson } from "../readPackageJson";

export const parseOptions = (options: {
  githubAccessToken?: string;
  repository?: string;
  dotEnvFilename?: string;
  dotEnvTemplateFilename?: string;
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
    dotEnvTemplateFilename: options.dotEnvTemplateFilename,
    delete: options.delete,
  };
};
