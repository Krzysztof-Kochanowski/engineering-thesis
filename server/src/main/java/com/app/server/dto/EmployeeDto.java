package com.app.server.dto;

import lombok.Value;

import java.io.Serializable;

@Value
public class EmployeeDto implements Serializable {
    int id;
    String username;
    String firstName;
    String lastName;
}