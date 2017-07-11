import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { MessageService } from "./message.service";
import { Message } from "./message.model";

@Component({
    selector: 'app-message-input',
    templateUrl: './message-input.component.html'
})
//we use oninit function to listen on messages
export class MessageInputComponent implements OnInit {
    message: Message;

    constructor(private messageService: MessageService) {}

    onSubmit(form: NgForm) {
        if (this.message) {
            // Edit
            this.message.content = form.value.content;
            //we use mssage service imported and we can now use an http function with subscribe method to get results
            this.messageService.updateMessage(this.message)
                .subscribe(
                    result => console.log(result)
                );
            this.message = null;
        } else {
            // Create
            const message = new Message(form.value.content, 'Max');
            this.messageService.addMessage(message)
                .subscribe(
                    data => console.log(data),
                    error => console.error(error)
                );
        }
        form.resetForm();
    }
    //clear form
    onClear(form: NgForm) {
        this.message = null;
        form.resetForm();
    }
    //here we listening on change messages
    ngOnInit() {
        this.messageService.messageIsEdit.subscribe(
            (message: Message) => this.message = message
        );
    }
}