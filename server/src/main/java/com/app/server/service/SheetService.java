package com.app.server.service;

import com.app.server.dto.SheetInfoDto;
import com.app.server.dto.display.SheetDisplayDto;
import com.app.server.entity.Customer;
import com.app.server.entity.Employee;
import com.app.server.entity.PlannedVisit;
import com.app.server.entity.Sheet;
import com.app.server.exception.EmptyCellException;
import com.app.server.mapper.SheetMapper;
import com.app.server.repository.CustomerRepository;
import com.app.server.repository.EmployeeRepository;
import com.app.server.repository.SheetRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SheetService {
    private final SheetRepository repository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final VisitService visitService;
    private final SheetMapper mapper;
    private final ExcelService excelService;

    public List<SheetDisplayDto> findAll() {
        return mapper.asDisplayDtoList(repository.findAll());
    }

    public void processExcelFile(InputStream stream, String filename, SheetInfoDto info) throws EmptyCellException {
        org.apache.poi.ss.usermodel.Sheet excelSheet = excelService.getExcelSheet(stream);

        while (repository.findByFileName(filename).isPresent()) {
            filename = filename + "_copy";
        }

        Sheet sheet = new Sheet(filename, info.getStartDate(), info.getEndDate());
        List<PlannedVisit> plannedVisits = new ArrayList<>();

        importDataFromSheet(excelSheet, sheet, info, plannedVisits);

        sheet.setPlannedVisitList(plannedVisits);
        Sheet savedSheet = repository.save(sheet);

        // Removes pre-existing visits to prevent collisions
        visitService.deleteInDateRange(savedSheet.getStartDate(), savedSheet.getEndDate());
        // Fixes date ranges of colliding sheets
        repository.findOverlappingSheets(savedSheet.getStartDate(), savedSheet.getEndDate(), savedSheet.getId())
                .forEach(overlapping -> {
                    fixOverlappingDateRange(overlapping, savedSheet.getStartDate(), savedSheet.getEndDate());
                    repository.save(overlapping);
                });
        visitService.addFromPlannedVisits(savedSheet);
    }

    private void importDataFromSheet(org.apache.poi.ss.usermodel.Sheet excelSheet, Sheet sheet,
                                     SheetInfoDto info, List<PlannedVisit> plannedVisits) {
        Map<String, Customer> customers = new HashMap<>();
        int employeeCount = 0;
        while (employeeCount < info.getTotalEmployees()) {
            Employee employee = importEmployeeInfo(excelSheet, employeeCount, info);
            importPlannedVisits(excelSheet, employee, employeeCount, info, customers, plannedVisits, sheet);
            employeeCount += 1;
        }
    }

    private Employee importEmployeeInfo(org.apache.poi.ss.usermodel.Sheet excelSheet,
                                              int employeeCount, SheetInfoDto info) {
        Row row = excelSheet.getRow(0);
        int idx = employeeCount * info.getColumnsPerEmployee() + info.getLeadingColumns();
        String[] properties = excelService.getAdjacentCellValues(row, idx, 3);

        if (containsEmptyString(properties)) {
            excelService.throwEmptyCellException(row, idx, properties, info.getLeadingColumns());
        }

        Optional<Employee> matchingEmployee = employeeRepository.findByUsername(properties[2]);
        return matchingEmployee.orElseGet(() -> new Employee(properties[0], properties[1], properties[2]));
    }

    private void importPlannedVisits(org.apache.poi.ss.usermodel.Sheet excelSheet,
                                Employee employee, int employeeCount, SheetInfoDto info,
                                 Map<String, Customer> customers, List<PlannedVisit> plannedVisits, Sheet sheet) {
        int rowCount = 1;
        while (rowCount < info.getDaysTotal() * info.getRowsPerDay() + info.getLeadingColumns()) {
            Row row = excelSheet.getRow(rowCount++);
            int idx = employeeCount * info.getColumnsPerEmployee() + info.getLeadingColumns();

            String[] properties = excelService.getAdjacentCellValues(row, idx, 3);

            if (containsEmptyString(properties)) {
                if (Arrays.stream(properties).allMatch(p -> p.length() == 0)) {
                    continue;
                } else {
                    excelService.throwEmptyCellException(row, idx, properties, info.getLeadingColumns());
                }
            }


            int dayOfWeek = (row.getRowNum() - 1) / info.getRowsPerDay();
            PlannedVisit pVisit = new PlannedVisit(excelService.getTimeCell(row, idx), employee, dayOfWeek, sheet);

            // If not already present, customer entity used is stored in a map
            // the map is then used to reduce amount of repository method calls
            String concatenatedProperties = properties[0] + properties[1] + properties[2];
            Customer mappedCustomer = customers.get(concatenatedProperties);

            if (mappedCustomer == null) {
                Customer customer = new Customer(properties[0], properties[1], properties[2]);
                ExampleMatcher customerMatcher = ExampleMatcher.matchingAll().withIgnoreNullValues().withIgnoreCase()
                        .withIgnorePaths("id");
                Optional<Customer> matchingCustomer = customerRepository.findOne(Example.of(customer, customerMatcher));

                if (matchingCustomer.isPresent()) {
                    customers.put(concatenatedProperties, matchingCustomer.get());
                    pVisit.setCustomer(matchingCustomer.get());
                } else {
                    customers.put(concatenatedProperties, customer);
                    pVisit.setCustomer(customer);
                }
            } else {
                pVisit.setCustomer(mappedCustomer);
            }

            plannedVisits.add(pVisit);
        }
    }

    private void fixOverlappingDateRange(Sheet overlapping, Instant startLimit, Instant endLimit) {
        Instant startDate = overlapping.getStartDate();
        Instant endDate = overlapping.getStartDate();
        if (startDate.isAfter(startLimit))
            startDate = endLimit.plus(1, ChronoUnit.MICROS);
        if (endDate.isBefore(endLimit) || (startDate.isBefore(startLimit) && endDate.isAfter(endLimit)))
            endDate = startLimit.minus(1, ChronoUnit.MICROS);
        if (startDate.isAfter(endDate)) {
            startDate = null;
            endDate = null;
        }
        overlapping.setStartDate(startDate);
        overlapping.setEndDate(endDate);
    }

    private boolean containsEmptyString(String[] values) {
        return Arrays.stream(values).anyMatch(v -> v.length() == 0);
    }
}