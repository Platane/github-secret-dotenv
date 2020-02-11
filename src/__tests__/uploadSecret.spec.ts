import { listSecrets, createSecretUploader } from "../github";
import { owner, repo, accessToken } from "../__fixtures__/repository";

it("uploadSecret", async () => {
  const now = Date.now();

  const uploadSecret = createSecretUploader({ owner, repo, accessToken });
  await uploadSecret(
    "XXX_TEST",
    "__test__" + Math.random().toString() + "__test__"
  );

  const secrets = await listSecrets({ owner, repo, accessToken });

  const secret = secrets.find(x => x.name === "XXX_TEST");

  expect(secret).toBeDefined();
  expect(secret && secret.updated_at).toBeGreaterThan(now);
});
