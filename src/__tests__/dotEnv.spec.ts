import path from "path";
import { readEnv } from "../dotEnv";

it("read simple .env", async () => {
  const env = readEnv({
    path: path.resolve(__dirname, "..", "__fixtures__", ".env.simple")
  });

  expect(env).toEqual([{ name: "XXX_TEST", value: "0000000000" }]);
});
