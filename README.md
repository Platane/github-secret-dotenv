# Github Secret Manager

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/github-secret-dotenv?style=flat-square)](https://www.npmjs.com/package/github-secret-dotenv)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Platane/github-secret-dotenv/main?style=flat-square)](https://github.com/Platane/github-secret-dotenv/actions?query=workflow%3Amain)

> Upload secrets in github from your .env file

![terminal screenshot](https://raw.githubusercontent.com/Platane/github-secret-dotenv/master/doc/terminal-screenshot.jpg)

# Usage

```
github-secret --repository platane/github-secret-dotenv --path ./.env --githubAccessToken xxxx
```

> if `repository` is omitted, the github repository is read from the package.json

> `githubAccessToken` can be passed as env var `GITHUB_ACCESS_TOKEN`
