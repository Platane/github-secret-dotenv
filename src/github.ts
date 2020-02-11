import { Octokit } from "@octokit/rest";
import { encrypt } from "./encrypt";

export const listSecrets = async ({ owner, repo, accessToken }) => {
  const octokit = new Octokit({
    auth: accessToken
  });

  const { data } = await octokit.actions.listSecretsForRepo({
    per_page: 100,
    owner,
    repo
  });

  return data.secrets.map(x => ({
    name: x.name,
    created_at: new Date(x.created_at).getTime(),
    updated_at: new Date(x.updated_at).getTime()
  }));
};

export const createSecretUploader = ({ owner, repo, accessToken }) => {
  const octokit = new Octokit({
    auth: accessToken
  });

  const p = octokit.actions.getPublicKey({
    owner,
    repo
  });

  return async (name: string, value: string) => {
    const {
      data: { key, key_id }
    } = await p;

    const encrypted_value = encrypt(key, value);

    console.log(encrypted_value);

    await octokit.actions.createOrUpdateSecretForRepo({
      owner,
      repo,
      name,
      key_id,
      encrypted_value
    });
  };
};
