import path from "path";
import { readEnv } from "../dotEnv";

it("should read simple .env", async () => {
  const env = readEnv({
    path: path.resolve(__dirname, "..", "__fixtures__", ".env.simple"),
  });

  expect(env).toContainEqual({ name: "XXX_TEST", value: "0000000000" });
});

it("should not interpolate with context env var", async () => {
  const env = readEnv({
    path: path.resolve(__dirname, "..", "__fixtures__", ".env.simple"),
  });

  expect(env).toContainEqual({ name: "LEAK_TEST", value: "0000000000" });
});

it("should expand dotenv vars", () => {
  const env = readEnv({
    path: path.resolve(__dirname, "..", "__fixtures__", ".env.simple"),
  });
  expect(env).toContainEqual({ name: "ZZZ_TEST", value: "00000000001" });
});
