import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';

interface Message {
  author: Author;
  message: string;
}

enum Author {
  James = 'james',
  User = 'user',
}

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {
  messages: Array<Message> = [];
  currentText: string;

  constructor(
    private chatBotService: ChatbotService
  ) { }

  ngOnInit() {
  }

  talk() {
    if (!this.currentText) {
      return;
    }

    const numberOfMessages = this.messages.length;
    if (numberOfMessages === 0 || (this.messages.length > 0 && this.messages[numberOfMessages - 1].message !== this.currentText)) {
      const message = {
        author: Author.User,
        message: this.currentText
      } as Message;

      this.messages.push(message);
    }
    this.chatBotService.chat(this.currentText).subscribe(response => {
      console.log('chat response', response);

      const message = {
        author: Author.James,
        message: response['fulfillmentText']
      } as Message;

      this.messages.push(message);
    });

    this.currentText = '';
  }

}

