require("dotenv").config();
import { readPackageJson } from "../readPackageJson";

const m = readPackageJson() as any;

export const owner = m.owner;
export const repo = m.repo;
export const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN as string;
