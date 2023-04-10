package com.app.server.repository;

import com.app.server.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface VisitRepository extends JpaRepository<Visit, Integer> {
    Optional<Visit> findByEmployeeIdAndDateTime(int employeeId, Instant dateTime);
    @Query("SELECT v FROM Visit v WHERE v.dateTime>=:startDate AND v.dateTime<:endDate AND v.employee.id=:employeeId" +
            " ORDER BY v.dateTime ASC")
    List<Visit> findByEmployeeAndDateRange(int employeeId, Instant startDate, Instant endDate);
    @Query("SELECT v FROM Visit v WHERE v.dateTime>=:startDate AND v.dateTime<:endDate")
    List<Visit> findByDateRange(Instant startDate, Instant endDate);
    @Modifying
    @Transactional
    @Query("DELETE FROM Visit v WHERE v.dateTime>=:startDate AND v.dateTime<:endDate")
    void deleteInDateRange(Instant startDate, Instant endDate);
}