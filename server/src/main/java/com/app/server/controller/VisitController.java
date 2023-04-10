package com.app.server.controller;

import com.app.server.dto.display.VisitDisplayDto;
import com.app.server.entity.Visit;
import com.app.server.service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/visit")
public class VisitController {
    private final VisitService visitService;

    @GetMapping("/day")
    @PreAuthorize("hasRole('STAFF') || #employeeId == authentication.principal.getEmployeeId()")
    ResponseEntity<List<VisitDisplayDto>> getVisitDetailsList (
            @RequestParam(name = "employee-id") final int employeeId,
            @RequestParam(name = "date-time") final String date
    ) {
        List<Visit> visits = visitService.findByDate(employeeId, Instant.parse(date));
        return ResponseEntity.ok(visitService.getDisplayDto(visits));
    }
}
