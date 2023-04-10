package com.app.server.security.customuserdetails;

import com.app.server.entity.User;
import com.app.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        Optional<User> existingUser = userRepository.findByUsernameIgnoreCase(username);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            return new UserDetails(user);
        } else {
            throw new UsernameNotFoundException(username);
        }
    }
}
