package com.app.server.entity;

import com.app.server.entity.related.BaseEntity;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user", schema = "public", catalog = "dbname")
public class User extends BaseEntity {
    private String username;
    private String password;
    private Set<String> roles = new HashSet<>();
    private Employee employee;

    public User() {}

    public User(String username, String password, Set<String> roles) {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }

    public User(String username, String password, Set<String> roles, Employee employee) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.employee = employee;
    }

    public User(User user) {
        this.username = user.getPassword();
        this.password = user.getPassword();
        this.roles = user.getRoles();
        this.employee = user.getEmployee();
    }

    @Basic
    @Column(name = "username", nullable = false, length = 255, unique = true)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Basic
    @Column(name = "password", nullable = false, length = 255)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "roles", nullable = false, length = 255)
    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    @OneToOne(fetch = FetchType.EAGER, mappedBy = "user")
    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        if (employee == null) {
            if (this.employee != null)
                this.employee.setUser(null);
        } else {
            this.employee = employee;
            this.employee.setUser(this);
        }
    }
}
