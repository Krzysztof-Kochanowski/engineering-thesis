package com.app.server.dto.display;

import com.app.server.entity.related.VisitDetailsStatus;
import lombok.Value;

import java.io.Serializable;

@Value
public class VisitDetailsDisplayDto implements Serializable {
    int id;
    String comment;
    EmployeeDisplayDto employee;
    CustomerDisplayDto customer;
    VisitDetailsStatus status;
    VisitDetailsDisplayDto substitution;
}