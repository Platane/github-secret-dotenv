# Github Secret DotEnv

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/github-secret-dotenv?style=flat-square)](https://www.npmjs.com/package/github-secret-dotenv)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Platane/github-secret-dotenv/main?style=flat-square&label=test)](https://github.com/Platane/github-secret-dotenv/actions?query=workflow%3Amain)

> Upload secrets to github from your .env file

![terminal screenshot](https://raw.githubusercontent.com/Platane/github-secret-dotenv/master/doc/terminal-screenshot.jpg)

# Usage

```sh
github-secret \

  --repository platane/github-secret-dotenv \
  # The github repository (<owner>/<repo>)
  # If omitted, read it from the package.json

  --dotEnvFilename ./.env \
  # The .env file to read
  # Default to .env

  --githubAccessToken xxxx
  # Your github access token
  # If omitted, read it from GITHUB_ACCESS_TOKEN env var
  # Generate one from https://github.com/settings/tokens/new
  # Must have permissions [public_repo  read:public_key]

  --delete
  # When set, remove all secrets that are not in the .env
```
