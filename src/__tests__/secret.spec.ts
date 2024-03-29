import { listSecrets, createSecretUpdater, removeSecret } from "../github";
import { owner, repo, githubAccessToken } from "../__fixtures__/repository";

jest.setTimeout(10000);

it("should have defined access token (otherwise tests below will fail)", () => {
  expect(githubAccessToken).toBeDefined();
});

it("list secrets", async () => {
  const secrets = await listSecrets({ owner, repo, githubAccessToken });

  expect(secrets.length).toBeGreaterThan(0);
});

it("update secret", async () => {
  const now = Date.now();

  const updateSecret = createSecretUpdater({ owner, repo, githubAccessToken });
  await updateSecret(
    "XXX_TEST",
    "__test__" + Math.random().toString() + "__test__"
  );

  {
    const secrets = await listSecrets({ owner, repo, githubAccessToken });
    const secret = secrets.find((x) => x.name === "XXX_TEST");
    expect(secret).toBeDefined();
    expect(secret && secret.updated_at).toBeGreaterThan(now - 1000);
  }
});

it("remove secret", async () => {
  const updateSecret = createSecretUpdater({ owner, repo, githubAccessToken });
  await updateSecret(
    "YYY_TEST",
    "__test__" + Math.random().toString() + "__test__"
  );

  {
    const secrets = await listSecrets({ owner, repo, githubAccessToken });
    const secret = secrets.find((x) => x.name === "YYY_TEST");
    expect(secret).toBeDefined();
  }

  await removeSecret({ owner, repo, githubAccessToken }, "YYY_TEST");

  {
    const secrets = await listSecrets({ owner, repo, githubAccessToken });
    const secret = secrets.find((x) => x.name === "YYY_TEST");
    expect(secret).toBeUndefined();
  }
});
