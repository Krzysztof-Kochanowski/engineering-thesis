package com.app.server.controller;

import com.app.server.dto.EmployeeAbsenceDto;
import com.app.server.dto.display.EmployeeAbsenceDisplayDto;
import com.app.server.entity.EmployeeAbsence;
import com.app.server.service.EmployeeAbsenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/employee-absence")
@PreAuthorize("hasRole('STAFF')")
public class EmployeeAbsenceController {
    private final EmployeeAbsenceService employeeAbsenceService;

    @GetMapping()
    ResponseEntity<List<EmployeeAbsenceDisplayDto>> getEmployeeAbsences (
            @RequestParam(name = "employee-id", required = false) final Optional<Integer> employeeId,
            @RequestParam(name = "start-date", required = false) final Optional<String> startDateTime,
            @RequestParam(name = "end-date", required = false) final Optional<String> endDateTime
    ) {
        return ResponseEntity.ok(employeeAbsenceService.getDisplayDto(employeeAbsenceService.findAll(employeeId, startDateTime, endDateTime)));
    }

    @PostMapping
    ResponseEntity<EmployeeAbsenceDisplayDto> addEmployeeAbsence(
            @RequestBody EmployeeAbsenceDto employeeAbsenceDto
    ) {
        EmployeeAbsence employeeAbsence = employeeAbsenceService.save(employeeAbsenceDto);
        return ResponseEntity.created(URI.create("/" + employeeAbsenceService.getDisplayDto(employeeAbsence).getId()))
                .body(employeeAbsenceService.getDisplayDto(employeeAbsence));
    }

    @PutMapping("/{id}")
    ResponseEntity<EmployeeAbsenceDisplayDto> updateEmployeeAbsence(
            @PathVariable(name = "id") final int id,
            @RequestBody EmployeeAbsenceDisplayDto employeeAbsenceDisplayDto
    ) {
        EmployeeAbsence employeeAbsence = employeeAbsenceService.update(id, employeeAbsenceDisplayDto);
        return ResponseEntity.created(URI.create("/" + employeeAbsence.getId()))
                .body(employeeAbsenceService.getDisplayDto(employeeAbsence));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteEmployeeAbsence (
            @PathVariable(name = "id") final int id
    ) {
        if (employeeAbsenceService.deleteEmployeeAbsence(id))
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.notFound().build();
    }
}
