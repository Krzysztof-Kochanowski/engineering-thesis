package com.app.server.dto;

import lombok.Value;

import java.io.Serializable;

@Value
public class CustomerDto implements Serializable {
    int id;
    String firstName;
    String lastName;
    String organizationName;
}
