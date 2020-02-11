import { readPackageJson, parsePackageJson } from "../readRepository";
import path from "path";

it("parse from repository.url", async () => {
  expect(
    parsePackageJson({
      repository: { url: "https://github.com/platane/github-secret-manager" }
    })
  ).toEqual({
    owner: "platane",
    repo: "github-secret-manager"
  });
});

it("parse from author and name", async () => {
  expect(
    parsePackageJson({
      name: "github-secret-manager",
      author: { name: "platane" }
    })
  ).toEqual({
    owner: "platane",
    repo: "github-secret-manager"
  });
});

it("readPackageJson", async () => {
  expect(readPackageJson(path.resolve(__dirname, "../.."))).toEqual({
    owner: "platane",
    repo: "github-secret-manager"
  });
});
