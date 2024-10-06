import CryptoJS from "crypto-js";

export class EncryptionService {
  private secretKey: string;
  private static readonly SALT_SIZE = 128 / 8; // 128-bit salt
  private static readonly IV_SIZE = 128 / 8; // 128-bit IV
  private static readonly KEY_SIZE = 256 / 32; // 256-bit key
  private static readonly ITERATIONS = 10000; // PBKDF2 iterations

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private deriveKey(salt: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray {
    return CryptoJS.PBKDF2(this.secretKey, salt, {
      keySize: EncryptionService.KEY_SIZE,
      iterations: EncryptionService.ITERATIONS,
    });
  }

  public encrypt(text: string): string {
    const iv = CryptoJS.lib.WordArray.random(EncryptionService.IV_SIZE);
    const salt = CryptoJS.lib.WordArray.random(EncryptionService.SALT_SIZE);
    const key = this.deriveKey(salt);
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
    });
    const ivString = iv.toString(CryptoJS.enc.Hex);
    const saltString = salt.toString(CryptoJS.enc.Hex);
    const encryptedString = encrypted.toString();
    return `${encryptedString}:${saltString}:${ivString}`;
  }

  public decrypt(ciphertext: string): string {
    const [encryptedText, saltHex, ivHex] = ciphertext.split(":");
    const salt = CryptoJS.enc.Hex.parse(saltHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const key = this.deriveKey(salt);
    const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedText);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedBytes,
    });
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
