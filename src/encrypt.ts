import nacl from "tweetnacl";
import { decodeUTF8, decodeBase64, encodeBase64 } from "tweetnacl-util";
import { seal } from "tweetsodium";

export const encrypt = (publicKey: string, message: string) =>
  encodeBase64(seal(decodeUTF8(message), decodeBase64(publicKey)));
