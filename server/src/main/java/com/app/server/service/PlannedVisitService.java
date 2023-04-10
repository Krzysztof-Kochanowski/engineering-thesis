package com.app.server.service;

import com.app.server.dto.display.PlannedVisitDisplayDto;
import com.app.server.entity.PlannedVisit;
import com.app.server.mapper.PlannedVisitMapper;
import com.app.server.repository.PlannedVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlannedVisitService {
    private final PlannedVisitRepository repository;
    private final PlannedVisitMapper mapper;

    public List<List<PlannedVisit>> findAllForWeek(int sheetId, int employeeId) {
        List<List<PlannedVisit>> result = new ArrayList<>(5);
        for (int dayOfWeek = 0; dayOfWeek < 5; dayOfWeek++) {
            result.add(repository.findBySheetIdAndDayOfWeekAndEmployeeId(sheetId, dayOfWeek, employeeId));
        }
        return result;
    }

    public List<PlannedVisitDisplayDto> getDisplayDto(List<PlannedVisit> plannedVisits) {
        return mapper.asDisplayDtoList(plannedVisits);
    }
}