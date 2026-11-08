import type { User } from "./User";

export class Message {
  readonly sentAt = new Date();
  private editedAt: Date | null = null;
  private text: string;

  constructor(
    readonly id: number,
    readonly author: User,
    text: string,
  ) {
    this.text = this.validateText(text);
  }

  getText(): string {
    return this.text;
  }

  getEditedAt(): Date | null {
    return this.editedAt;
  }

  edit(text: string): void {
    this.text = this.validateText(text);
    this.editedAt = new Date();
  }

  private validateText(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error("Message cannot be empty.");
    }
    return trimmed;
  }
}
