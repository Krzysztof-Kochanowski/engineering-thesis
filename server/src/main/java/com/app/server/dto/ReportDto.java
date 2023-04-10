package com.app.server.dto;

import com.app.server.entity.related.ReportOption;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Optional;

@Value
public class ReportDto implements Serializable {
    String[] reportHeaders;
    LinkedHashSet<ReportOption> reportOptions;
    @Getter(AccessLevel.NONE)
    String startDate;
    @Getter(AccessLevel.NONE)
    String endDate;

    public Optional<Instant> getStartDate() {
        if (this.startDate == null) {
            return Optional.empty();
        } else {
            return Optional.of(Instant.parse(this.startDate));
        }
    }

    public Optional<Instant> getEndDate() {
        if (this.endDate == null) {
            return Optional.empty();
        } else {
            return Optional.of(Instant.parse(this.endDate));
        }
    }
}