package com.app.server.dto.display;

import lombok.Value;

import java.io.Serializable;

@Value
public class CustomerDisplayDto implements Serializable {
    int id;
    String firstName;
    String lastName;
    String organizationName;
}
