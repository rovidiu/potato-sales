export class Message {
  id: string;
  type: MessageType;
  message: string;

  constructor(init?: Partial<Message>) {
    Object.assign(this, init);
  }
}

export enum MessageType {
  Success,
  Error,
  Info,
  Warning
}