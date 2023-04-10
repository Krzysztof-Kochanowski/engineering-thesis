package com.app.server.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

@Value
public class SheetInfoDto implements Serializable {
    int leadingColumns = 1;
    int daysTotal = 5;
    int rowsPerDay = 21;
    int totalEmployees = 3;
    int columnsPerEmployee = 4;
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
