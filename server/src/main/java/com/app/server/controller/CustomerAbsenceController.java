package com.app.server.controller;

import com.app.server.dto.CustomerAbsenceDto;
import com.app.server.dto.display.CustomerAbsenceDisplayDto;
import com.app.server.entity.CustomerAbsence;
import com.app.server.service.CustomerAbsenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer-absence")
@PreAuthorize("hasRole('STAFF')")
public class CustomerAbsenceController {
    private final CustomerAbsenceService customerAbsenceService;

    @GetMapping()
    ResponseEntity<List<CustomerAbsenceDisplayDto>> getCustomerAbsences (
            @RequestParam(name = "start-date", required = false) final Optional<String> startDateTime,
            @RequestParam(name = "end-date", required = false) final Optional<String> endDateTime
    ) {
        return ResponseEntity.ok(customerAbsenceService.getDisplayDto(customerAbsenceService.findAll(startDateTime, endDateTime)));
    }

    @PostMapping
    ResponseEntity<CustomerAbsenceDisplayDto> addCustomerAbsence(
            @RequestBody CustomerAbsenceDto customerAbsenceDto
    ) {
        CustomerAbsence customerAbsence = customerAbsenceService.save(customerAbsenceDto);
        return ResponseEntity.created(URI.create("/" + customerAbsenceService.getDisplayDto(customerAbsence).getId()))
                .body(customerAbsenceService.getDisplayDto(customerAbsence));
    }

    @PutMapping("/{id}")
    ResponseEntity<CustomerAbsenceDisplayDto> updateCustomerAbsence(
            @PathVariable(name = "id") final int id,
            @RequestBody CustomerAbsenceDisplayDto customerAbsenceDisplayDto
    ) {
        CustomerAbsence customerAbsence = customerAbsenceService.update(id, customerAbsenceDisplayDto);
        return ResponseEntity.created(URI.create("/" + customerAbsence.getId()))
                .body(customerAbsenceService.getDisplayDto(customerAbsence));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteCustomerAbsence (
            @PathVariable(name = "id") final int id
    ) {
        if (customerAbsenceService.deleteCustomerAbsence(id))
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.notFound().build();
    }
}
