// src/services/mailer.ts
import type { 
  Mailer, 
  EmailMessage, 
  EmailDeliveryResult, 
  MailerConfig 
} from "./types";
import fs from "fs/promises";
import path from "path";

// Real SendGrid implementation
export class RealMailer implements Mailer {
  private sendGrid: any;
  private fromEmail: string;
  private fromName: string;

  constructor(config: MailerConfig) {
    // Lazy load SendGrid to avoid import errors in SAFE_MODE
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(config.apiKey);
      this.sendGrid = sgMail;
    } catch (error) {
      console.warn("⚠️  SendGrid not installed, falling back to mock");
      throw new Error("SendGrid package not available");
    }
    
    this.fromEmail = config.from.email;
    this.fromName = config.from.name;
  }

  async send(message: EmailMessage): Promise<EmailDeliveryResult> {
    try {
      const msg = {
        to: message.to,
        from: {
          email: message.from?.email || this.fromEmail,
          name: message.from?.name || this.fromName,
        },
        subject: message.subject,
        html: message.html,
        text: message.text,
      };

      const [response] = await this.sendGrid.send(msg);
      
      return {
        success: true,
        messageId: response.headers['x-message-id'],
      };
    } catch (error: any) {
      console.error("SendGrid error:", error);
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }
  }

  async sendBatch(messages: EmailMessage[]): Promise<EmailDeliveryResult[]> {
    // Send in parallel with some concurrency limit
    const BATCH_SIZE = 10;
    const results: EmailDeliveryResult[] = [];
    
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(msg => this.send(msg));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }
}

// Mock implementation that writes to local files
export class MockMailer implements Mailer {
  private mailboxDir: string;

  constructor() {
    this.mailboxDir = path.join(process.cwd(), ".mailbox");
    this.ensureMailboxDir();
  }

  private async ensureMailboxDir() {
    try {
      await fs.access(this.mailboxDir);
    } catch {
      await fs.mkdir(this.mailboxDir, { recursive: true });
      console.log(`📧 Created mailbox directory: ${this.mailboxDir}`);
    }
  }

  async send(message: EmailMessage): Promise<EmailDeliveryResult> {
    try {
      await this.ensureMailboxDir();
      
      const messageId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const filename = `${messageId}.eml`;
      const filepath = path.join(this.mailboxDir, filename);
      
      // Create EML format content
      const emlContent = this.createEMLContent(message, messageId);
      
      await fs.writeFile(filepath, emlContent, 'utf-8');
      
      console.log(`📧 Email delivered to mock mailbox: ${filename}`);
      
      return {
        success: true,
        messageId,
      };
    } catch (error: any) {
      console.error("Mock mailer error:", error);
      return {
        success: false,
        error: error.message || "Failed to write mock email",
      };
    }
  }

  async sendBatch(messages: EmailMessage[]): Promise<EmailDeliveryResult[]> {
    const results: EmailDeliveryResult[] = [];
    
    for (const message of messages) {
      const result = await this.send(message);
      results.push(result);
    }
    
    return results;
  }

  private createEMLContent(message: EmailMessage, messageId: string): string {
    const now = new Date().toUTCString();
    const from = message.from || { email: "dev@localhost", name: "Development App" };
    
    return `Message-ID: <${messageId}@localhost>
Date: ${now}
From: ${from.name} <${from.email}>
To: ${message.to}
Subject: ${message.subject}
MIME-Version: 1.0
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: 8bit

${message.html}

${message.text ? `

--- TEXT VERSION ---
${message.text}` : ''}
`;
  }

  // Utility method to list emails in mailbox
  async listEmails(): Promise<string[]> {
    try {
      await this.ensureMailboxDir();
      const files = await fs.readdir(this.mailboxDir);
      return files.filter(file => file.endsWith('.eml')).sort().reverse();
    } catch {
      return [];
    }
  }

  // Utility method to read a specific email
  async readEmail(filename: string): Promise<string | null> {
    try {
      const filepath = path.join(this.mailboxDir, filename);
      return await fs.readFile(filepath, 'utf-8');
    } catch {
      return null;
    }
  }

  // Utility method to clear mailbox
  async clearMailbox(): Promise<void> {
    try {
      const files = await this.listEmails();
      const deletePromises = files.map(file => 
        fs.unlink(path.join(this.mailboxDir, file))
      );
      await Promise.all(deletePromises);
      console.log(`🗑️  Cleared ${files.length} emails from mailbox`);
    } catch (error) {
      console.error("Error clearing mailbox:", error);
    }
  }
}

// Export both for convenience
export { RealMailer as Mailer };
