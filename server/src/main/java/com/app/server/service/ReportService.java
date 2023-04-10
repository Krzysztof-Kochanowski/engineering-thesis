package com.app.server.service;

import com.app.server.entity.related.Record;
import com.app.server.entity.related.ReportOption;
import com.app.server.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository repository;

    public List<Record> getReport(Optional<Instant> startDate, Optional<Instant> endDate, LinkedHashSet<ReportOption> reportOptions) {
        boolean visitStatus = reportOptions.contains(ReportOption.VISIT_STATUS);
        boolean organization = reportOptions.contains(ReportOption.ORGANIZATION);
        boolean employee = reportOptions.contains(ReportOption.EMPLOYEE);

        if (visitStatus && organization && employee) {
            return repository.countWithStatusOrganizationEmployee(startDate.orElse(null), endDate.orElse(null));
        }
        if (visitStatus && organization) {
            return repository.countWithStatusOrganization(startDate.orElse(null), endDate.orElse(null));
        }
        if (organization && employee) {
            return repository.countWithOrganizationEmployee(startDate.orElse(null), endDate.orElse(null));
        }
        if (visitStatus && employee) {
            return repository.countWithStatusEmployee(startDate.orElse(null), endDate.orElse(null));
        }
        if (visitStatus) {
            return repository.countWithStatus(startDate.orElse(null), endDate.orElse(null));
        }
        if (organization) {
            return repository.countWithOrganization(startDate.orElse(null), endDate.orElse(null));
        }
        if (employee) {
            return repository.countWithEmployee(startDate.orElse(null), endDate.orElse(null));
        }
        return null;
    }
}
