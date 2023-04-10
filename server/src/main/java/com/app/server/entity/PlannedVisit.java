package com.app.server.entity;

import com.app.server.entity.related.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Collection;

@Entity
@Table(name = "planned_visit", schema = "public", catalog = "dbname", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employee_id", "day_of_week", "visit_time", "sheet_id"})
})
public class PlannedVisit extends BaseEntity {
    private LocalTime visitTime;
    private String zoneId = ZoneId.of("Europe/Warsaw").toString();
    private int dayOfWeek;
    private Sheet sheet;
    private Employee employee;
    private Customer customer;
    private Collection<Visit> visitList;

    public PlannedVisit() {
    }

    public PlannedVisit(LocalTime visitTime, Employee employee, int dayOfWeek, Sheet sheet) {
        this.visitTime = visitTime;
        this.dayOfWeek = dayOfWeek;
        this.sheet = sheet;
        this.employee = employee;
    }

    @Basic
    @Column(name = "visit_time", nullable = false)
    public LocalTime getVisitTime() {
        return visitTime;
    }

    public void setVisitTime(LocalTime visitTime) {
        this.visitTime = visitTime;
    }

    @Basic
    @Column(name = "zone_id", nullable = false)
    public ZoneId getZoneId() {
        return ZoneId.of(zoneId);
    }

    public void setZoneId(ZoneId zoneId) {
        this.zoneId = zoneId.toString();
    }

    @Column(name = "day_of_week", nullable = false)
    public int getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(int dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "sheet_id", referencedColumnName = "id", nullable = false)
    public Sheet getSheet() {
        return sheet;
    }

    public void setSheet(Sheet sheet) {
        this.sheet = sheet;
    }

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "customer_id", referencedColumnName = "id", nullable = false)
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    @OneToMany(mappedBy = "plannedVisit", fetch = FetchType.LAZY)
    public Collection<Visit> getVisitList() {
        return visitList;
    }

    public void setVisitList(Collection<Visit> visitList) {
        this.visitList = visitList;
    }
}
