package com.app.server.dto.display;

import com.app.server.mapper.Default;
import lombok.Getter;

import java.io.Serializable;
import java.time.ZoneId;

@Getter
public class PlannedVisitDisplayDto implements Serializable {
    String visitTime;
    ZoneId zoneId;
    CustomerDisplayDto customer;
    EmployeeDisplayDto employee;
    int dayOfWeek;

    @Default
    public PlannedVisitDisplayDto(String visitTime, ZoneId zoneId, CustomerDisplayDto customer, EmployeeDisplayDto employee,
                                  int dayOfWeek) {
        this.visitTime = visitTime;
        this.zoneId = zoneId;
        this.customer = customer;
        this.employee = employee;
        this.dayOfWeek = dayOfWeek;
    }
}