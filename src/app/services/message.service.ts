import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Message, MessageType } from '../models';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private subject = new Subject<Message>();
  private defaultId = 'default-message';

  /**
   * Subscribing to messages observable
   * @param {string} id
   * @returns {Observable<Message>}
   */
  onMessage(id = this.defaultId): Observable<Message> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  /**
   * success message
   * @param {string} message
   * @param options
   */
  success(message: string, options?: any) {
    this.message(new Message({ ...options, type: MessageType.Success, message }));
  }

  /**
   * error message
   * @param {string} message
   * @param options
   */
  error(message: string, options?: any) {
    this.message(new Message({ ...options, type: MessageType.Error, message }));
  }

  /**
   * message method
   * @param {Message} message
   */
  message(message: Message) {
    message.id = message.id || this.defaultId;

    this.subject.next(message);
  }

  /**
   * clear all the messages
   * @param {string} id
   */
  clear(id = this.defaultId) {
    this.subject.next(new Message({ id }));
  }
}
