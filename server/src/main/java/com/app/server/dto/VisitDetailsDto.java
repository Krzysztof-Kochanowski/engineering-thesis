package com.app.server.dto;

import com.app.server.entity.related.VisitDetailsStatus;
import lombok.Value;

import java.io.Serializable;

@Value
public class VisitDetailsDto implements Serializable {
    VisitDetailsStatus status;
    String comment;
    CustomerDto customer;
    int substitutingEmployeeId;
}