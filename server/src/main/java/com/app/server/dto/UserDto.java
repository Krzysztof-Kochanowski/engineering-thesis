package com.app.server.dto;

import com.app.server.dto.display.EmployeeDisplayDto;
import lombok.EqualsAndHashCode;
import lombok.Value;

import java.io.Serializable;
import java.util.Set;

@Value
@EqualsAndHashCode(callSuper = true)
public class UserDto extends UserAuthDto implements Serializable {
    int id;
    Set<String> roles;
    EmployeeDisplayDto employee;

    public UserDto(int id, String username, String password, Set<String> roles, EmployeeDisplayDto employee) {
        super(username, password);
        this.id = id;
        this.roles = roles;
        this.employee = employee;
    }
}