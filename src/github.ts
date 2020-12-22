import { Octokit } from "@octokit/rest";
import { encrypt } from "./encrypt";

export const listSecrets = async ({
  owner,
  repo,
  githubAccessToken,
}: {
  owner: string;
  repo: string;
  githubAccessToken: string;
}) => {
  const octokit = new Octokit({
    auth: githubAccessToken,
  });

  const { data } = await octokit.actions.listRepoSecrets({
    per_page: 100,
    owner,
    repo,
  });

  return data.secrets.map((x) => ({
    name: x.name,
    created_at: new Date(x.created_at).getTime(),
    updated_at: new Date(x.updated_at).getTime(),
  }));
};

export const removeSecret = async (
  {
    owner,
    repo,
    githubAccessToken,
  }: {
    owner: string;
    repo: string;
    githubAccessToken: string;
  },
  secretName: string
) => {
  const octokit = new Octokit({
    auth: githubAccessToken,
  });

  await octokit.actions.deleteRepoSecret({
    owner,
    repo,
    secret_name: secretName,
  });
};

/**
 * returns a function that can be used to set repository secret
 */
export const createSecretUpdater = ({
  owner,
  repo,
  githubAccessToken,
}: {
  owner: string;
  repo: string;
  githubAccessToken: string;
}) => {
  const octokit = new Octokit({
    auth: githubAccessToken,
  });

  const publicKeyPromise = octokit.actions.getRepoPublicKey({
    owner,
    repo,
  });

  const updateSecret = async (secretName: string, secretValue: string) => {
    const {
      data: { key, key_id },
    } = await publicKeyPromise;

    const encrypted_value = encrypt(key, secretValue);

    await octokit.actions.createOrUpdateRepoSecret({
      owner,
      repo,
      secret_name: secretName,
      key_id,
      encrypted_value,
    });
  };

  return updateSecret;
};
