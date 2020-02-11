require("dotenv").config();
import { readPackageJson } from "../readRepository";

const m = readPackageJson() as any;

export const owner = m.owner;
export const repo = m.repo;
export const accessToken = process.env.GITHUB_ACCESS_TOKEN as string;
