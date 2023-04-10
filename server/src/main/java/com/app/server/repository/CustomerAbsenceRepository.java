package com.app.server.repository;

import com.app.server.entity.CustomerAbsence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface CustomerAbsenceRepository extends JpaRepository<CustomerAbsence, Integer> {
    @Query("SELECT absence FROM CustomerAbsence absence" +
            " WHERE (cast(:startDate as timestamp) IS NULL OR absence.startDate >= :startDate)" +
            " AND (cast(:endDate as timestamp) IS NULL OR absence.endDate <= :endDate)")
    List<CustomerAbsence> findCustomerAbsences(Instant startDate, Instant endDate);
}