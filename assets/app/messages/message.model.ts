export class Message {
    content: string;
    username: string;
    messageId?: string;
    userId?: string;
// this is a message model for the front end
    constructor(content: string, username: string, messageId?: string, userId?: string) {
        this.content = content;
        this.username = username;
        this.messageId = messageId;
        this.userId = userId;
    }
}