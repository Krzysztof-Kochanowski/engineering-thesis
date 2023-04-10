package com.app.server;

import com.app.server.entity.User;
import com.app.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class CommandLineAppStartupRunner implements CommandLineRunner {
    private final Environment env;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public void run(String...args) {

        final String username = env.getProperty("admin.username");
        if (this.userRepository.findByUsernameIgnoreCase(username).isEmpty()) {
            final String password = encoder.encode(env.getProperty("admin.password"));
            Set<String> roles = new HashSet<>();
            roles.add("ADMIN");
            User admin = new User(username, password, roles);
            userRepository.save(admin);
        }
    }
}