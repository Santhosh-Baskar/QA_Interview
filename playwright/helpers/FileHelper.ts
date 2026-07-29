import * as fs from 'fs';
import * as path from 'path';

/**
 * File Helper Utility
 * Handles file operations for logging and data management
 */
export class FileHelper {
  /**
   * Append content to file
   */
  async appendToFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Append content to file
    fs.appendFileSync(filePath, content, 'utf8');
  }

  /**
   * Write content to file (overwrite)
   */
  async writeToFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf8');
  }

  /**
   * Read file content
   */
  async readFile(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      return '';
    }
    return fs.readFileSync(filePath, 'utf8');
  }

  /**
   * Check if file exists
   */
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Delete file
   */
  async deleteFile(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Clear file content
   */
  async clearFile(filePath: string): Promise<void> {
    await this.writeToFile(filePath, '');
  }
}
