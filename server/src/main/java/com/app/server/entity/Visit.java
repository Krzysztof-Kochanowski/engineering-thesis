package com.app.server.entity;

import com.app.server.entity.related.BaseEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "visit", schema = "public", catalog = "dbname", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employee_id", "date_time"})
})
public class Visit extends BaseEntity {
    private Instant dateTime;
    private PlannedVisit plannedVisit;
    private Employee employee;
    private Collection<VisitDetails> visitDetailsList;

    public Visit() {}

    public Visit(PlannedVisit plannedVisit, Instant dateTime) {
        this.dateTime = dateTime;
        this.plannedVisit = plannedVisit;
        this.employee = plannedVisit.getEmployee();
        VisitDetails visitDetails = new VisitDetails(plannedVisit.getCustomer(), this);
        this.visitDetailsList = new ArrayList<>(List.of(visitDetails));
    }

    public Visit(Instant dateTime, Employee employee, Collection<VisitDetails> visitDetailsList) {
        this.dateTime = dateTime;
        this.employee = employee;
        this.visitDetailsList = visitDetailsList;
    }

    public Visit(Instant dateTime, Employee employee, Collection<VisitDetails> visitDetailsList, PlannedVisit plannedVisit) {
        this.dateTime = dateTime;
        this.employee = employee;
        this.visitDetailsList = visitDetailsList;
        this.plannedVisit = plannedVisit;
    }

    @Basic
    @Column(name = "date_time", nullable = false)
    public Instant getDateTime() {
        return dateTime;
    }

    public void setDateTime(Instant dateTime) {
        this.dateTime = dateTime;
    }

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "planned_visit_id", referencedColumnName = "id", nullable = true)
    public PlannedVisit getPlannedVisit() {
        return plannedVisit;
    }
    
    public void setPlannedVisit(PlannedVisit plannedVisit) {
        this.plannedVisit = plannedVisit;
    }

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @OnDelete(action = OnDeleteAction.CASCADE)
    @OneToMany(mappedBy = "visit", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    public Collection<VisitDetails> getVisitDetailsList() {
        return visitDetailsList;
    }

    public void setVisitDetailsList(Collection<VisitDetails> visitDetailsList) {
        this.visitDetailsList = visitDetailsList;
    }

    public void addVisitDetails(VisitDetails visitDetails) {
        this.visitDetailsList.add(visitDetails);
        visitDetails.setVisit(this);
    }

    public void removeVisitDetails(VisitDetails visitDetails) {
        this.visitDetailsList.remove(visitDetails);
        visitDetails.setVisit(null);
    }
}
