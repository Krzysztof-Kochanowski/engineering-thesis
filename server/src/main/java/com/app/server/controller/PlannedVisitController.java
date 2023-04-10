package com.app.server.controller;

import com.app.server.dto.display.PlannedVisitDisplayDto;
import com.app.server.service.PlannedVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/planned-visit")
public class PlannedVisitController {
    private final PlannedVisitService plannedVisitService;

    @GetMapping(value = "/week")
    @PreAuthorize("hasRole('STAFF') || #employeeId == authentication.principal.getEmployeeId()")
    ResponseEntity<List<List<PlannedVisitDisplayDto>>> getPlannedVisitsForWeek (
            @RequestParam(name = "sheet-id") final int sheetId,
            @RequestParam(name = "employee-id") final int employeeId
    ) {
        return ResponseEntity.ok(plannedVisitService.findAllForWeek(sheetId, employeeId).stream()
                .map((plannedVisitService::getDisplayDto)).toList());
    }
}
