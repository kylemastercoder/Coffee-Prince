import EncryptionManager from "./crypto-manager";


class SessionManager {
  private manager: EncryptionManager;

  constructor() {
    this.manager = new EncryptionManager();
  }

  public async saveToSession(
    key: string,
    data: object | string
  ): Promise<void> {
    try {
      const stringifiedData = JSON.stringify(data);
      const encrypted = await this.manager.encrypt(stringifiedData);
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Error while saving to session storage:", error);
      throw error;
    }
  }

  public async retrieveFromSession(
    key: string
  ): Promise<object | string | null> {
    try {
      const encryptedData = sessionStorage.getItem(key);
      if (encryptedData) {
        const decrypted = await this.manager.decrypt(encryptedData);
        return JSON.parse(decrypted);
      }
      return null;
    } catch (error) {
      console.error("Error while retrieving from session storage:", error);
      throw error;
    }
  }

  public removeFromSession(key: string): void {
    sessionStorage.removeItem(key);
  }

  public clearSession(): void {
    sessionStorage.clear();
  }
}

export default SessionManager;
