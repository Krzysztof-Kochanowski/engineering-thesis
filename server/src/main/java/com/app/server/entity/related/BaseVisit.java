package com.app.server.entity.related;

import com.app.server.entity.Employee;
import com.app.server.entity.VisitDetails;
import jakarta.persistence.*;

import java.util.Collection;

@MappedSuperclass
public abstract class BaseVisit extends BaseEntity {
    protected Employee employee;
    protected Collection<VisitDetails> visitDetailsList;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @OneToMany(mappedBy = "visit", fetch = FetchType.EAGER)
    public Collection<VisitDetails> getVisitDetailsList() {
        return visitDetailsList;
    }

    public void setVisitDetailsList(Collection<VisitDetails> visitDetailsList) {
        this.visitDetailsList = visitDetailsList;
    }
}
