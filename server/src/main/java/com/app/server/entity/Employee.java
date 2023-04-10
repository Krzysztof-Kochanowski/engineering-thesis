package com.app.server.entity;

import com.app.server.entity.related.BaseEntity;
import jakarta.persistence.*;

import java.util.Collection;

@Entity
@Table(name = "employee", schema = "public", catalog = "dbname")
public class Employee extends BaseEntity {
    private String firstName;
    private String lastName;
    private Collection<Visit> visitList;
    private Collection<EmployeeAbsence> employeeAbsenceList;
    private String username;
    private User user;

    public Employee() {
    }

    public Employee(String firstName, String lastName, String username) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public Employee(String username) {
        this.username = username;
    }

    @Basic
    @Column(name = "first_name", nullable = true, length = 255)
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @Basic
    @Column(name = "last_name", nullable = true, length = 255)
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY)
    public Collection<Visit> getVisitList() {
        return visitList;
    }

    public void setVisitList(Collection<Visit> visitList) {
        this.visitList = visitList;
    }

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    public Collection<EmployeeAbsence> getEmployeeAbsenceList() {
        return employeeAbsenceList;
    }

    public void setEmployeeAbsenceList(Collection<EmployeeAbsence> employeeAbsenceList) {
        this.employeeAbsenceList = employeeAbsenceList;
    }

    @Basic
    @Column(name = "username", nullable = false, length = 255, unique = true)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
