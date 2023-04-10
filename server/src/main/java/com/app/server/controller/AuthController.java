package com.app.server.controller;

import com.app.server.dto.UserAuthDto;
import com.app.server.entity.User;
import com.app.server.security.customuserdetails.UserDetails;
import com.app.server.security.jwt.JwtResponse;
import com.app.server.security.jwt.JwtUtil;
import com.app.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody UserAuthDto loginRequest) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    ));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            Optional<User> user = userService.findByUsername(loginRequest.getUsername());
            if (user.isPresent()) {
                String token = jwtUtil.generateToken(new UserDetails(user.get()));
                return ResponseEntity.ok(new JwtResponse(token));
            } else {
                return ResponseEntity.badRequest().body("User not found");
            }
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}