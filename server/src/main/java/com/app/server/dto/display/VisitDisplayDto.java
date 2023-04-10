package com.app.server.dto.display;

import lombok.Value;

import java.io.Serializable;
import java.util.List;

@Value
public class VisitDisplayDto implements Serializable {
    int id;
    String dateTime;
    PlannedVisitDisplayDto plannedVisit;
    EmployeeDisplayDto employee;
    List<VisitDetailsDisplayDto> visitDetailsList;
}