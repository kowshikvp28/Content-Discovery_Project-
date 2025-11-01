package com.content.demo.exceptions;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private final HttpStatus status;

    /**
     * Constructs a new API exception with the specified status and message.
     * @param status The HTTP status code to return.
     * @param message The detail message.
     */
    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    /**
     * Constructs a new API exception with the specified status, message, and cause.
     * @param status The HTTP status code to return.
     * @param message The detail message.
     * @param cause The cause of the exception.
     */
    public ApiException(HttpStatus status, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    /**
     * Returns the HTTP status associated with this exception.
     * @return The HttpStatus.
     */
    public HttpStatus getStatus() {
        return status;
    }
}
