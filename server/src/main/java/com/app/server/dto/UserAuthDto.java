package com.app.server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serializable;

@AllArgsConstructor
@Getter
public class UserAuthDto implements Serializable {
    String username;
    String password;
}