package com.app.server.controller;

import com.app.server.dto.display.EmployeeDisplayDto;
import com.app.server.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/employee")
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_STAFF') || #id == authentication.principal.getEmployeeId()")
    ResponseEntity<EmployeeDisplayDto> getEmployee (
            @PathVariable(name = "id") final int id
    ) {
        return ResponseEntity.ok(employeeService.getDisplayDto(employeeService.findById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    ResponseEntity<List<EmployeeDisplayDto>> getEmployees () {
        return ResponseEntity.ok(employeeService.getDisplayDto(employeeService.findAll()));
    }
}
