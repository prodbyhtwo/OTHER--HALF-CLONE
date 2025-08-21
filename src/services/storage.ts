// src/services/storage.ts
import type {
  Storage,
  StorageFile,
  StorageUploadResult,
  StorageConfig,
} from "./types";
import fs from "fs/promises";
import path from "path";

// Real S3 implementation (placeholder - would need AWS SDK)
export class RealStorage implements Storage {
  private s3: any;
  private bucketName: string;

  constructor(config: StorageConfig) {
    this.bucketName = config.bucketName;

    try {
      // This would typically be AWS SDK
      // const AWS = require('aws-sdk');
      // this.s3 = new AWS.S3({
      //   accessKeyId: config.accessKey,
      //   secretAccessKey: config.secretKey,
      //   region: config.region,
      // });
      throw new Error("AWS SDK not implemented in this example");
    } catch (error) {
      console.warn("⚠️  AWS SDK not available, falling back to mock storage");
      throw error;
    }
  }

  async upload(
    file: Buffer,
    key: string,
    contentType: string,
  ): Promise<StorageUploadResult> {
    // Implementation would use AWS S3 upload
    throw new Error("Real storage not implemented");
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    // Implementation would use AWS S3 getSignedUrl
    throw new Error("Real storage not implemented");
  }

  async delete(key: string): Promise<{ success: boolean }> {
    // Implementation would use AWS S3 deleteObject
    throw new Error("Real storage not implemented");
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    // Implementation would use AWS S3 listObjects
    throw new Error("Real storage not implemented");
  }
}

// Mock implementation using local filesystem
export class MockStorage implements Storage {
  private storageDir: string;
  private baseUrl: string;

  constructor() {
    this.storageDir = path.join(process.cwd(), ".storage");
    this.baseUrl = "http://localhost:8080/__storage";
    this.ensureStorageDir();
  }

  private async ensureStorageDir() {
    try {
      await fs.access(this.storageDir);
    } catch {
      await fs.mkdir(this.storageDir, { recursive: true });
      console.log(`🗄️  Created storage directory: ${this.storageDir}`);
    }
  }

  async upload(
    file: Buffer,
    key: string,
    contentType: string,
  ): Promise<StorageUploadResult> {
    try {
      await this.ensureStorageDir();

      // Ensure the directory structure exists
      const keyDir = path.dirname(key);
      if (keyDir !== ".") {
        const fullDir = path.join(this.storageDir, keyDir);
        await fs.mkdir(fullDir, { recursive: true });
      }

      const filePath = path.join(this.storageDir, key);
      await fs.writeFile(filePath, file);

      const stats = await fs.stat(filePath);
      const url = `${this.baseUrl}/${key}`;

      const storageFile: StorageFile = {
        key,
        url,
        size: stats.size,
        contentType,
      };

      console.log(
        `🗄️  File uploaded to mock storage: ${key} (${stats.size} bytes)`,
      );

      return {
        success: true,
        file: storageFile,
      };
    } catch (error: any) {
      console.error("Mock storage upload error:", error);
      return {
        success: false,
        error: error.message || "Failed to upload file",
      };
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    // In mock mode, we just return a direct URL since there's no real auth
    // In a real implementation, this would generate a time-limited signed URL
    const timestamp = Date.now() + expiresIn * 1000;
    return `${this.baseUrl}/${key}?expires=${timestamp}&signature=mock`;
  }

  async delete(key: string): Promise<{ success: boolean }> {
    try {
      const filePath = path.join(this.storageDir, key);
      await fs.unlink(filePath);
      console.log(`🗑️  File deleted from mock storage: ${key}`);
      return { success: true };
    } catch (error) {
      console.error("Mock storage delete error:", error);
      return { success: false };
    }
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    try {
      await this.ensureStorageDir();

      const files: StorageFile[] = [];

      async function walkDir(
        dir: string,
        currentPrefix: string = "",
      ): Promise<void> {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path
            .join(currentPrefix, entry.name)
            .replace(/\\/g, "/");

          if (entry.isDirectory()) {
            await walkDir(fullPath, relativePath);
          } else {
            if (!prefix || relativePath.startsWith(prefix)) {
              const stats = await fs.stat(fullPath);
              files.push({
                key: relativePath,
                url: `${this.baseUrl}/${relativePath}`,
                size: stats.size,
                contentType: this.guessContentType(relativePath),
              });
            }
          }
        }
      }

      await walkDir(this.storageDir);
      return files.sort((a, b) => a.key.localeCompare(b.key));
    } catch (error) {
      console.error("Mock storage list error:", error);
      return [];
    }
  }

  private guessContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
    };

    return mimeTypes[ext] || "application/octet-stream";
  }

  // Mock-specific utility methods
  async clearStorage(): Promise<void> {
    try {
      const files = await this.list();
      const deletePromises = files.map((file) => this.delete(file.key));
      await Promise.all(deletePromises);
      console.log(`🗑️  Cleared ${files.length} files from mock storage`);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  getStorageDir(): string {
    return this.storageDir;
  }
}

// Export both for convenience
export { RealStorage as Storage };
