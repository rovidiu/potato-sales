import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { Message, MessageType } from '../../../models';
import { MessageService } from '../../../services';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit, OnDestroy {
  @Input() id = 'default-message';

  messages: Message[] = [];
  messageSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private router: Router, private messageService: MessageService) {
  }

  ngOnInit() {
    // subscribe to new message notifications
    this.messageSubscription = this.messageService.onMessage(this.id)
      .subscribe(message => {
        // clear messages when an empty alert is received
        if (!message.message) {
          return;
        }

        // add alert to array
        this.messages.push(message);
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.messageService.clear(this.id);
      }
    });
  }

  /**
   * unsubscribe to avoid memory leaks
   */
  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  /**
   * on close message click
   * @param {Message} message
   */
  removeMessage(message: Message) {
    // check if already removed to prevent error on auto close
    if (!this.messages.includes(message)) return;

    // remove message
    this.messages = this.messages.filter(x => x !== message);
  }

  /**
   * return the right css class based on the type of the message (error, success...)
   * @param {Message} message
   * @returns {any}
   */
  cssClass(message: Message) {
    if (!message) {
      return;
    }

    const classes = ['alert', 'alert-dismissable', 'mt-4', 'container'];

    const messageTypeClass = {
      [MessageType.Success]: 'alert alert-success',
      [MessageType.Error]: 'alert alert-danger',
      [MessageType.Info]: 'alert alert-info',
      [MessageType.Warning]: 'alert alert-warning'
    }

    classes.push(messageTypeClass[message.type]);

    return classes.join(' ');
  }
}
