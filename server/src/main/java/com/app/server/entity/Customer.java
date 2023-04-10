package com.app.server.entity;

import com.app.server.entity.related.BaseEntity;
import jakarta.persistence.*;

import java.util.Collection;

@Entity
@Table(name = "customer", schema = "public", catalog = "dbname", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"first_name", "last_name", "organization_name"})
})
public class Customer extends BaseEntity {
    private String firstName;
    private String lastName;
    private String organizationName;
    private Collection<VisitDetails> visitDetailsList;
    private Collection<CustomerAbsence> customerAbsenceList;

    public Customer() {
    }

    public Customer(String firstname, String lastName, String organizationName) {
        this.firstName = firstname;
        this.lastName = lastName;
        this.organizationName = organizationName;
    }

    @Basic
    @Column(name = "first_name", nullable = false, length = 255)
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @Basic
    @Column(name = "last_name", nullable = false, length = 255)
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @Basic
    @Column(name = "organization_name", nullable = false, length = 255)
    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    public Collection<VisitDetails> getVisitDetailsList() {
        return visitDetailsList;
    }

    public void setVisitDetailsList(Collection<VisitDetails> visitDetailsList) {
        this.visitDetailsList = visitDetailsList;
    }

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    public Collection<CustomerAbsence> getCustomerAbsenceList() {
        return customerAbsenceList;
    }

    public void setCustomerAbsenceList(Collection<CustomerAbsence> customerAbsenceList) {
        this.customerAbsenceList = customerAbsenceList;
    }
}
