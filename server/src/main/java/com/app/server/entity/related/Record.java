package com.app.server.entity.related;

public class Record {
    private Long count;
    private VisitDetailsStatus status = null;
    private String organization = null;
    private String employee = null;

    public Record(Long count, VisitDetailsStatus status, String organization, String employee) {
        this.count = count;
        this.status = status;
        this.organization = organization;
        this.employee = employee;
    }

    public Record(Long count, String organization, String employee) {
        this.count = count;
        this.organization = organization;
        this.employee = employee;
    }

    public Record(Long count, VisitDetailsStatus status) {
        this.count = count;
        this.status = status;
    }

    public Record(Long count) {
        this.count = count;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public VisitDetailsStatus getStatus() {
        return status;
    }

    public void setStatus(VisitDetailsStatus status) {
        this.status = status;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getEmployee() {
        return employee;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }
}
