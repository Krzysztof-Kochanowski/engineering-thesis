package com.app.server.exception;

public class EmptyCellException extends RuntimeException {
    public EmptyCellException(String errorMessage) {
        super(errorMessage);
    }
}