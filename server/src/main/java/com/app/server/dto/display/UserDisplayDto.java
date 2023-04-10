package com.app.server.dto.display;

import lombok.Value;

import java.io.Serializable;
import java.util.Set;

@Value
public class UserDisplayDto implements Serializable {
    int id;
    String username;
    Set<String> roles;
    EmployeeDisplayDto employee;
}