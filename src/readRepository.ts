import fs from "fs";
import path from "path";

export const parsePackageJson = (
  pkg
): { owner: string; repo: string } | undefined => {
  {
    const repositoryUrl =
      (pkg.repository && pkg.repository.url) || pkg.repository || "";

    const m =
      repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(.git)?$/) ||
      repositoryUrl.match(/github:([^\/]+)\/([^\/]+)$/);

    if (m) return { owner: m[1], repo: m[2] };
  }

  const authorName =
    (pkg.author && pkg.author.github) ||
    (pkg.author && pkg.author.name) ||
    pkg.author;

  if (typeof authorName === "string" && typeof pkg.name === "string")
    return { owner: authorName, repo: pkg.name };
};

export const readPackageJson = (cwd = "") => {
  const fileName = path.resolve(cwd, "package.json");

  try {
    const content = fs.readFileSync(fileName).toString();
    const pkg = JSON.parse(content);

    return parsePackageJson(pkg);
  } catch (err) {}
};
