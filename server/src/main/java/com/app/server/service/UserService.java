package com.app.server.service;

import com.app.server.dto.UserDto;
import com.app.server.dto.display.UserDisplayDto;
import com.app.server.entity.Employee;
import com.app.server.entity.User;
import com.app.server.exception.DuplicateUserException;
import com.app.server.mapper.UserMapper;
import com.app.server.repository.EmployeeRepository;
import com.app.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper mapper;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder encoder;
    private final UserRepository repository;

    public List<User> findAll() {
        return this.repository.findAll();
    }

    public Optional<User> findByUsername(String username) {
        return repository.findByUsernameIgnoreCase(username);
    }

    @PreAuthorize("authentication.principal.roles.contains('ADMIN') or !#dto.roles.contains('ADMIN')")
    public User save(UserDto dto) throws DuplicateUserException {
        final String username = dto.getUsername();
        final String password = encoder.encode(dto.getPassword());

        if ((repository.findByUsernameIgnoreCase(username)).isPresent()) {
            throw new DuplicateUserException(
                    "User already exists : " + username);
        }

        Optional<Employee> employee = Optional.empty();

        if (dto.getEmployee() != null) {
            employee = employeeRepository.findById(dto.getEmployee().getId());
        }

        User user = new User(username, password, dto.getRoles(), employee.orElse(null));

        return repository.save(user);
    }

    @PreAuthorize("authentication.principal.roles.contains('ADMIN') or !#dto.roles.contains('ADMIN')")
    public User update(int id, UserDisplayDto dto) throws HttpClientErrorException.Unauthorized {
        Optional<User> existingUser = repository.findById(id);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (dto.getEmployee() == null) {
                user.setEmployee(null);
            } else {
                Optional<Employee> existingEmployee = employeeRepository.findById(dto.getEmployee().getId());
                existingEmployee.ifPresent(user::setEmployee);
            }
            user.setRoles(dto.getRoles());
            return repository.save(user);
        }
        return null;
    }

    public UserDisplayDto getDisplayDto(User user) {
        return mapper.asDisplayDto(user);
    }

    public List<UserDisplayDto> getDisplayDto(List<User> users) {
        return this.mapper.asDisplayDtoList(users);
    }

    @PreAuthorize("!{@userService.containsAdmin(#id)}")
    public boolean deleteUser(int id) {
        Optional<User> existingUser = repository.findById(id);
        boolean exists = existingUser.isPresent();
        if (exists) {
            this.repository.deleteById(id);
        }
        return exists;
    }


    // Used in PreAuthorize annotation
    public boolean containsAdmin(int id) {
        Optional<User> existingUser = repository.findById(id);
        if (existingUser.isEmpty())
            return false;
        return existingUser.get().getRoles().contains("ADMIN");
    }
}

