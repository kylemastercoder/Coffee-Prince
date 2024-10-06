import * as dotenv from "dotenv";
import { EncryptionService } from "./crypto";
dotenv.config({ path: ".env" });

dotenv.config();

class EncryptionManager {
  private encryptionService: EncryptionService;

  constructor() {
    const secretKey = process.env.NEXT_PUBLIC_CRYPTO_KEY!;
    this.encryptionService = new EncryptionService(secretKey);
  }

  public encrypt(text: string): string {
    return this.encryptionService.encrypt(text);
  }

  public decrypt(ciphertext: string): string {
    return this.encryptionService.decrypt(ciphertext);
  }
}

export default EncryptionManager;
