package com.app.server.entity;

import com.app.server.entity.related.BaseEntity;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.Collection;

@Entity
@Table(name = "sheet", schema = "public", catalog = "dbname")
public class Sheet extends BaseEntity {
    private String fileName;
    private Instant startDate;
    private Instant endDate;
    Collection<PlannedVisit> plannedVisitList;

    public Sheet() {
    }

    public Sheet(String fileName, Instant startDate, Instant endDate) {
        this.fileName = fileName;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    @Basic
    @Column(name = "file_name", nullable = false, length = 255, unique = true)
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @Basic
    @Column(name = "start_date", nullable = true)
    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    @Basic
    @Column(name = "end_date", nullable = true)
    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    @OneToMany(mappedBy = "sheet", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    public Collection<PlannedVisit> getPlannedVisitList() {
        return plannedVisitList;
    }

    public void setPlannedVisitList(Collection<PlannedVisit> plannedVisitList) {
        this.plannedVisitList = plannedVisitList;
    }
}
