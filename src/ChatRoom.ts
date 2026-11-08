import { Message } from "./Message";
import type { User } from "./User";

export class ChatRoom {
  private readonly members = new Map<string, User>();
  private readonly messages: Message[] = [];

  constructor(readonly name: string) {}

  join(user: User): void {
    this.members.set(user.id, user);
  }

  getMembers(): User[] {
    return [...this.members.values()];
  }

  sendMessage(userId: string, text: string): Message {
    const author = this.members.get(userId);
    if (!author) {
      throw new Error("Join the room before sending a message.");
    }

    const message = new Message(this.messages.length + 1, author, text);
    this.messages.push(message);
    return message;
  }

  getMessages(): readonly Message[] {
    return [...this.messages];
  }

  editMessage(userId: string, messageId: number, text: string): void {
    const message = this.messages.find(entry => entry.id === messageId);
    if (!message || message.author.id !== userId) {
      throw new Error("You can only edit your own messages.");
    }
    message.edit(text);
  }

  searchMessages(query: string): Message[] {
    const search = query.trim().toLowerCase();
    if (!search) {
      return [];
    }

    return this.messages.filter(message =>
      message.getText().toLowerCase().includes(search),
    );
  }
}
