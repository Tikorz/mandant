// Bridge API für lokale Folder Bridge Anwendung
const BRIDGE_URL = 'http://localhost:8080';

export class FolderBridge {
  static async createFolder(folderName: string): Promise<boolean> {
    try {
      const response = await fetch(`${BRIDGE_URL}/create-folder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: folderName
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.success;
      }
      return false;
    } catch (error) {
      console.warn('Bridge nicht verfügbar:', error);
      return false;
    }
  }

  static async getStatus(): Promise<{active: boolean, drive?: string, folders?: number}> {
    try {
      const response = await fetch(`${BRIDGE_URL}/status`);
      if (response.ok) {
        const result = await response.json();
        return {active: true, drive: result.drive, folders: result.folders};
      }
      return {active: false};
    } catch (error) {
      return {active: false};
    }
  }
}