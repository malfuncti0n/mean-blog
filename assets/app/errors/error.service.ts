import { EventEmitter } from "@angular/core";

import { Error } from "./error.model";

//when new error happent with event emiter
export class ErrorService {
    errorOccurred = new EventEmitter<Error>();

    handleError(error: any) {
        const errorData = new Error(error.title, error.error.message);
        this.errorOccurred.emit(errorData);
    }
}