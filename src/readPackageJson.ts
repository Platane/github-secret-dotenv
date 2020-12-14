import path from "path";

/**
 * read the package.json from the package directory
 * guess the github owner / repository from it
 */
export const readPackageJson = (packageDir = "") => {
  const fileName = path.resolve(packageDir, "package.json");

  try {
    const pkg = require(fileName);

    return parsePackageJson(pkg);
  } catch (err) {}
};

/**
 * guess the github owner / repository from a package json file
 * either get it from the repository field
 * or author + name
 */
export const parsePackageJson = (
  pkg: any
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
