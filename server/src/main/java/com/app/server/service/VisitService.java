package com.app.server.service;

import com.app.server.dto.display.VisitDisplayDto;
import com.app.server.entity.Employee;
import com.app.server.entity.PlannedVisit;
import com.app.server.entity.Sheet;
import com.app.server.entity.Visit;
import com.app.server.entity.related.VisitDetailsStatus;
import com.app.server.mapper.VisitMapper;
import com.app.server.repository.EmployeeRepository;
import com.app.server.repository.PlannedVisitRepository;
import com.app.server.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VisitService {
    private final VisitRepository repository;
    private final PlannedVisitRepository plannedVisitRepository;
    private final EmployeeRepository employeeRepository;
    private final VisitMapper mapper;

    public Visit getVisit(Instant dateTime, int employeeId) {
        Optional<Employee> employee = this.employeeRepository.findById(employeeId);
        if (employee.isPresent()) {
            Optional<Visit> existingVisit = repository.findByEmployeeIdAndDateTime(employeeId, dateTime);
            return existingVisit.orElseGet(() -> this.repository.save(new Visit(dateTime, employee.get(), new ArrayList<>())));
        }
        return null;
    }

    public List<Visit> findByDate(int employeeId, Instant date) {
        Instant startOfDay = date.truncatedTo(ChronoUnit.DAYS);
        Instant endOfDay = startOfDay.plus(Duration.ofDays(1));
        return this.repository.findByEmployeeAndDateRange(employeeId, startOfDay, endOfDay);
    }

    public void deleteInDateRange(Instant startDate, Instant endDate) {
        this.repository.deleteInDateRange(startDate, endDate);
    }

    public void addFromPlannedVisits(Sheet sheet) {
        List<PlannedVisit> plannedVisits = this.plannedVisitRepository.findBySheet(sheet);
        Instant date = sheet.getStartDate();
        Instant lastDay = sheet.getEndDate();

        while (date.isBefore(lastDay) || date.equals(lastDay)) {
            for (PlannedVisit p: plannedVisits) {
                if (p.getDayOfWeek() == (date.atZone(p.getZoneId()).getDayOfWeek().getValue() - 1)) {
                    Instant visitDateTime = date.atZone(p.getZoneId())
                            .withHour(p.getVisitTime().getHour())
                            .withMinute(p.getVisitTime().getMinute())
                            .withSecond(p.getVisitTime().getSecond())
                            .withNano(p.getVisitTime().getNano())
                            .toInstant();
                    this.repository.save(new Visit(p, visitDateTime));
                }
            }
            date = date.plus(1, ChronoUnit.DAYS);
        }
    }

    public void applyEmployeeAbsence(int employeeId, Instant startDate, Instant endDate) {
        List<Visit> visits = this.repository.findByEmployeeAndDateRange(employeeId, startDate, endDate);
        visits.forEach(visit
                -> visit.getVisitDetailsList().forEach(visitDetails
                        -> {
                    if (visitDetails.getVisitDetailsStatus() == VisitDetailsStatus.PRESENT) {
                        visitDetails.setVisitDetailsStatus(VisitDetailsStatus.ABSENT_EMPLOYEE);
                    }
                })
        );
        this.repository.saveAll(visits);
    }

    public void applyCustomerAbsence(int customerId, Instant startDate, Instant endDate) {
        List<Visit> visits = this.repository.findByDateRange(startDate, endDate);
        visits.forEach(visit
                -> visit.getVisitDetailsList().stream()
                .filter(visitDetails -> visitDetails.getCustomer().getId() == customerId)
                .forEach(visitDetails
                -> {
                    if (visitDetails.getVisitDetailsStatus() == VisitDetailsStatus.PRESENT) {
                        visitDetails.setVisitDetailsStatus(VisitDetailsStatus.CANCELLED);
                    }
                })
        );
        this.repository.saveAll(visits);
    }

    public void removeEmployeeAbsence(int employeeId, Instant startDate, Instant endDate) {
        List<Visit> visits = this.repository.findByEmployeeAndDateRange(employeeId, startDate, endDate);
        visits.forEach(visit
                -> visit.getVisitDetailsList().forEach(visitDetails
                -> {
                    if (visitDetails.getVisitDetailsStatus() == VisitDetailsStatus.ABSENT_EMPLOYEE) {
                        visitDetails.setVisitDetailsStatus(VisitDetailsStatus.PRESENT);
                    }
                })
        );
        this.repository.saveAll(visits);
    }

    public void removeCustomerAbsence(int customerId, Instant startDate, Instant endDate) {
        List<Visit> visits = this.repository.findByDateRange(startDate, endDate);
        visits.forEach(visit
                -> visit.getVisitDetailsList().stream()
                .filter(visitDetails -> visitDetails.getCustomer().getId() == customerId)
                .forEach(visitDetails
                        -> {
                    if (visitDetails.getVisitDetailsStatus() == VisitDetailsStatus.CANCELLED) {
                        visitDetails.setVisitDetailsStatus(VisitDetailsStatus.PRESENT);
                    }
                })
        );
        this.repository.saveAll(visits);
    }

    public List<VisitDisplayDto> getDisplayDto(List<Visit> visitList) {
        return mapper.asDisplayDtoList(visitList);
    }
}
