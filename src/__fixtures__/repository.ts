require("dotenv").config();
import { repository } from "../../package.json";

export const [owner, repo] = repository.replace(/^github:/, "").split("/");
export const accessToken = process.env.GITHUB_ACCESS_TOKEN as string;
