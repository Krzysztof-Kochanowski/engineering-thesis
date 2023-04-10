package com.app.server.repository;

import com.app.server.entity.VisitDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitDetailsRepository extends JpaRepository<VisitDetails, Integer> {
    Optional<VisitDetails> findByCustomerIdAndVisitId(int customerId, int visitId);
}