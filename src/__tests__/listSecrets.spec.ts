import { listSecrets } from "../github";
import { owner, repo, accessToken } from "../__fixtures__/repository";

it("listSecrets", async () => {
  const secrets = await listSecrets({ owner, repo, accessToken });

  console.log(secrets);
});
