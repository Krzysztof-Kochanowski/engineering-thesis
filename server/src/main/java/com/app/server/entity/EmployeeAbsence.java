package com.app.server.entity;

import com.app.server.entity.related.BaseEntity;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "employee_absence", schema = "public", catalog = "dbname", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employee_id", "start_date", "end_date"})
})
public class EmployeeAbsence extends BaseEntity {
    private Instant startDate;
    private Instant endDate;
    private Employee employee;

    @Basic
    @Column(name = "start_date", nullable = false)
    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    @Basic
    @Column(name = "end_date", nullable = false)
    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
