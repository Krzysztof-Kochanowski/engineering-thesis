package com.app.server.dto.display;

import lombok.Value;

import java.io.Serializable;

@Value
public class EmployeeDisplayDto implements Serializable {
    int id;
    String username;
    String firstName;
    String lastName;
    UserDisplayDto userDisplayDto;
}