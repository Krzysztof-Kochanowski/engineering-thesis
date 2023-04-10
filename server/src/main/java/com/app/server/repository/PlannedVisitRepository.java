package com.app.server.repository;

import com.app.server.entity.PlannedVisit;
import com.app.server.entity.Sheet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlannedVisitRepository extends JpaRepository<PlannedVisit, Integer> {
    List<PlannedVisit> findBySheet(Sheet sheet);
    List<PlannedVisit> findBySheetIdAndDayOfWeekAndEmployeeId(int sheetId, int dayOfWeek, int employeeId);
}
