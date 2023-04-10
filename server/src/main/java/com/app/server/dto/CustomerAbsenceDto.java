package com.app.server.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

@Value
public class CustomerAbsenceDto implements Serializable {
    CustomerDto customer;
    @Getter(AccessLevel.NONE)
    String startDate;
    @Getter(AccessLevel.NONE)
    String endDate;

    public Instant getStartDate() {
        return Instant.parse(this.startDate);
    }

    public Instant getEndDate() {
        return Instant.parse(this.endDate);
    }
}