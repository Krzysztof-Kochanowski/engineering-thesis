package com.app.server.controller;

import com.app.server.dto.VisitDetailsDto;
import com.app.server.dto.display.VisitDetailsDisplayDto;
import com.app.server.entity.VisitDetails;
import com.app.server.service.VisitDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping("/visit-details")
public class VisitDetailsController {
    private final VisitDetailsService visitDetailsService;

    @PostMapping
    @PreAuthorize("hasRole('STAFF') || #employeeId == authentication.principal.getEmployeeId()")
    ResponseEntity<VisitDetailsDisplayDto> addVisitDetails(
            @RequestParam(name = "employee-id") final int employeeId,
            @RequestParam(name = "date-time") final String dateTime,
            @RequestBody VisitDetailsDto visitDetailsDto
    ) {
        VisitDetails visitDetails = visitDetailsService.save(visitDetailsDto, Instant.parse(dateTime), employeeId);
        return ResponseEntity.created(URI.create("/" + visitDetailsService.getDisplayDto(visitDetails).getId()))
                .body(visitDetailsService.getDisplayDto(visitDetails));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF') || #employeeId == authentication.principal.getEmployeeId()")
    ResponseEntity<VisitDetailsDisplayDto> updateVisitDetails(
            @RequestParam(name = "employee-id") final int employeeId,
            @PathVariable(name = "id") final int id,
            @RequestBody VisitDetailsDto visitDetailsDto
    ) {
        VisitDetails visitDetails = visitDetailsService.update(id, visitDetailsDto);
        return ResponseEntity.created(URI.create("/" + visitDetails.getId()))
                .body(visitDetailsService.getDisplayDto(visitDetails));
    }
}
