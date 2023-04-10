package com.app.server.security.customuserdetails;

import com.app.server.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

public class UserDetails extends User implements org.springframework.security.core.userdetails.UserDetails {
    private static final long serialVersionUID = 1L;
    private User user;

    public UserDetails(User user) {
        super(user);
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();

        for (String role : user.getRoles()){
            grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        }
        return grantedAuthorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getUsername() {
        return this.user.getUsername();
    }

    @Override
    public String getPassword() {
        return this.user.getPassword();
    }

    public int getId() {
        return this.user.getId();
    }

    public Integer getEmployeeId() {
        return (this.user.getEmployee() != null) ? this.user.getEmployee().getId() : null;
    }
}