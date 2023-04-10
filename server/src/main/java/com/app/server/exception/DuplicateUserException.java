package com.app.server.exception;

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String errorMessage) {
        super(errorMessage);
    }
}