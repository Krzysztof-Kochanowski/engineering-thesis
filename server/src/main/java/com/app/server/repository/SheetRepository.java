package com.app.server.repository;

import com.app.server.entity.Sheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface SheetRepository extends JpaRepository<Sheet, Integer> {
    Optional<Sheet> findByFileName(String filename);

    @Query("SELECT sheet FROM Sheet sheet" +
            " WHERE sheet.id <> :excludedId" +
            " AND sheet.startDate <= :endDate" +
            " AND sheet.endDate >= :startDate")
    List<Sheet> findOverlappingSheets(Instant startDate, Instant endDate, int excludedId);
}