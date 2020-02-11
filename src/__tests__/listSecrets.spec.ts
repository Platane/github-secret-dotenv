import { listSecrets } from "../github";
import { owner, repo, accessToken } from "../__fixtures__/repository";

it("listSecrets", async () => {
  const secrets = await listSecrets({ owner, repo, accessToken });

  expect(secrets.find(s => s.name === "XXX_TEST")).toBeDefined();
});
