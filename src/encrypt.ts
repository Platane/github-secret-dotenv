import { decodeUTF8, decodeBase64, encodeBase64 } from "tweetnacl-util";
import { seal } from "tweetsodium";

/**
 * encrypt the message using the publicKey
 * using NaCl seal box
 * as expected by github secret upload protocol
 */
export const encrypt = (publicKey: string, message: string) =>
  encodeBase64(seal(decodeUTF8(message), decodeBase64(publicKey)));
