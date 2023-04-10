package com.app.server.repository;

import com.app.server.entity.EmployeeAbsence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface EmployeeAbsenceRepository extends JpaRepository<EmployeeAbsence, Integer> {
    @Query("SELECT absence FROM EmployeeAbsence absence" +
            " WHERE :employeeId IS NULL OR absence.employee.id = :employeeId" +
            " AND (cast(:startDate AS timestamp) IS NULL OR absence.startDate >= :startDate)" +
            " AND (cast(:endDate AS timestamp) IS NULL OR absence.endDate <= :endDate)")
    List<EmployeeAbsence> findEmployeeAbsences(Integer employeeId, Instant startDate, Instant endDate);

    @Query("SELECT absence FROM EmployeeAbsence absence" +
            " WHERE absence.id <> :excludedId" +
            " AND absence.employee.id = :employeeId" +
            " AND absence.startDate <= :endDate" +
            " AND absence.endDate >= :startDate")
    List<EmployeeAbsence> findOverlappingAbsences(int employeeId, Instant startDate, Instant endDate, int excludedId);
}