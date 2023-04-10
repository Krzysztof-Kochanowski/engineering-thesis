package com.app.server.entity;

import com.app.server.entity.related.BaseEntity;
import com.app.server.entity.related.VisitDetailsStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "visit_details", schema = "public", catalog = "dbname", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"visit_id", "customer_id"})
})
public class VisitDetails extends BaseEntity {
    @Enumerated(EnumType.ORDINAL)
    private VisitDetailsStatus visitDetailsStatus = VisitDetailsStatus.PRESENT;
    private String comment;
    private Customer customer;
    private Visit visit;
    private VisitDetails substitution;

    public VisitDetails() {}

    public VisitDetails(Customer customer, Visit visit) {
        this.customer = customer;
        this.visit = visit;
    }

    public VisitDetails(PlannedVisit plannedVisit) {
        this.customer = plannedVisit.getCustomer();
    }

    @Basic
    @Column(name = "status", nullable = false)
    public VisitDetailsStatus getVisitDetailsStatus() {
        return visitDetailsStatus;
    }

    public void setVisitDetailsStatus(VisitDetailsStatus visitDetailsStatus) {
        this.visitDetailsStatus = visitDetailsStatus;
    }

    @Basic
    @Column(name = "comment", nullable = true, length = 255)
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "customer_id", referencedColumnName = "id", nullable = false)
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "visit_id", referencedColumnName = "id", nullable = false)
    public Visit getVisit() {
        return visit;
    }

    public void setVisit(Visit visit) {
        this.visit = visit;
    }

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "substitution_id", referencedColumnName = "id", nullable = true)
    public VisitDetails getSubstitution() {
        return substitution;
    }

    public void setSubstitution(VisitDetails substitution) {
        this.substitution = substitution;
    }
}