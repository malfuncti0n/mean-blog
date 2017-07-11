import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Message } from "./message.model";

//we create a message service to be used from all our components
//we pass injectable because we want to injsect http on constuctor and we need to have metadata to inject (component or injectable
@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    //we use the htttp class to make http requests. different request method base on type
    constructor(private http: Http) {
    }

    //create a message
    addMessage(message: Message) {
        //make it json
        const body = JSON.stringify(message);
        //change response to json
        const headers = new Headers({'Content-Type': 'application/json'});
        // add jwt authentication token to the request
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        //prepare the post request. the call is not happend here. is happend with subscribe
        return this.http.post('http://localhost:3000/message' + token, body, {headers: headers})
            //map function map response data to wanted data
            .map((response: Response) => {
                const result = response.json();
                const message = new Message(
                    result.obj.content,
                    result.obj.user.firstName,
                    result.obj._id,
                    result.obj.user._id);
                this.messages.push(message);
                return message;
            })
            // catch function is an callback for error
            .catch((error: Response) => Observable.throw(error.json()));
    }
    //get a list of message
    getMessages() {
        //no authenticated
        return this.http.get('http://localhost:3000/message')
        //map function map response data to wanted data
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(
                        message.content,
                        message.user.firstName,
                        message._id,
                        message.user._id)
                    );
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            // catch function is an callback for error
            .catch((error: Response) => Observable.throw(error.json()));
    }
    //edit a messagage //in the front end
    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    //update a message with a patch request to the server
    updateMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch('http://localhost:3000/message/' + message.messageId + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
  //delete a message
    deleteMessage(message: Message) {
        //delete from the frontent
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        //delete from the backend
        return this.http.delete('http://localhost:3000/message/' + message.messageId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}