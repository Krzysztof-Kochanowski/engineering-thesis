package com.app.server.controller;

import com.app.server.dto.UserDto;
import com.app.server.dto.display.UserDisplayDto;
import com.app.server.entity.User;
import com.app.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@PreAuthorize("hasAuthority('ROLE_STAFF')")
public class UserController {
    private final UserService userService;

    @GetMapping()
    ResponseEntity<List<UserDisplayDto>> getUsers () {
        return ResponseEntity.ok(userService.getDisplayDto(userService.findAll()));
    }

    @PostMapping
    ResponseEntity<?> addUser(@RequestBody UserDto userDto) {
        if (userService.findByUsername(userDto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username taken");
        }
        User savedUser = userService.save(userDto);
        return ResponseEntity.created(URI.create("/" + savedUser.getId()))
                .body(userService.getDisplayDto(savedUser));
    }

    // This method should be updated to blacklist existing JWT tokens
    @PutMapping("/{id}")
    ResponseEntity<?> updateUser(
            @PathVariable(name = "id") final int id,
            @RequestBody UserDisplayDto userDisplayDto
    ) {
        User savedUser = userService.update(id, userDisplayDto);
        return ResponseEntity.created(URI.create("/" + savedUser.getId()))
                .body(userService.getDisplayDto(savedUser));

    }


    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteUser (@PathVariable(name = "id") final int id) {
        if (userService.deleteUser(id))
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.notFound().build();
    }
}
