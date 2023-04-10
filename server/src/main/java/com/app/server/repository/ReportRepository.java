package com.app.server.repository;

import com.app.server.entity.VisitDetails;
import com.app.server.entity.related.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface ReportRepository extends JpaRepository<VisitDetails, Integer> {
    @Query("SELECT new com.app.server.entity.related.Record(count(vd), vd.visitDetailsStatus, vd.customer.organizationName, concat(e.firstName, '', e.lastName))" +
            " FROM VisitDetails vd" +
            " INNER JOIN Visit v ON vd.visit.id = v.id" +
            " INNER JOIN Employee e ON v.employee.id = e.id" +
            " WHERE (cast(:startDate AS timestamp) IS NULL OR vd.visit.dateTime >= :startDate)" +
            " AND (cast(:endDate AS timestamp) IS NULL OR vd.visit.dateTime <= :endDate)" +
            " GROUP BY vd.visitDetailsStatus, vd.customer.organizationName, e.id")
    List<Record> countWithStatusOrganizationEmployee(Instant startDate, Instant endDate);

    @Query("SELECT new com.app.server.entity.related.Record(count(vd), vd.visitDetailsStatus, vd.customer.organizationName, 'null')" +
            " FROM VisitDetails vd" +
            " INNER JOIN Visit v ON vd.visit.id = v.id" +
            " WHERE (cast(:startDate AS timestamp) IS NULL OR vd.visit.dateTime >= :startDate)" +
            " AND (cast(:endDate AS timestamp) IS NULL OR vd.visit.dateTime <= :endDate)" +
            " GROUP BY vd.visitDetailsStatus, vd.customer.organizationName")
    List<Record> countWithStatusOrganization(Instant startDate, Instant endDate);

    @Query("SELECT new com.app.server.entity.related.Record(count(vd), vd.customer.organizationName, concat(e.firstName, '', e.lastName))" +
            " FROM VisitDetails vd" +
            " INNER JOIN Visit v ON vd.visit.id = v.id" +
            " INNER JOIN Employee e ON v.employee.id = e.id" +
            " WHERE (cast(:startDate AS timestamp) IS NULL OR vd.visit.dateTime >= :startDate)" +
            " AND (cast(:endDate AS timestamp) IS NULL OR vd.visit.dateTime <= :endDate)" +
            " GROUP BY vd.customer.organizationName, e.id")
    List<Record> countWithOrganizationEmployee(Instant startDate, Instant endDate);

    @Query("SELECT new com.app.server.entity.related.Record(count(vd), vd.visitDetailsStatus, 'null', concat(e.firstName, '', e.lastName))" +
            " FROM VisitDetails vd" +
            " INNER JOIN Visit v ON vd.visit.id = v.id" +
            " INNER JOIN Employee e ON v.employee.id = e.id" +
            " WHERE (cast(:startDate AS timestamp) IS NULL OR vd.visit.dateTime >= :startDate)" +
            " AND (cast(:endDate AS timestamp) IS NULL OR vd.visit.dateTime <= :endDate)" +
            " GROUP BY vd.visitDetailsStatus, e.id")
    List<Record> countWithStatusEmployee(Instant startDate, Instant endDate);

    @Query("SELECT new com.app.server.entity.related.Record(count(vd), vd.visitDetailsStatus)" +
            " FROM VisitDetails vd" +
            " WHERE (cast(:startDate AS timestamp) IS NULL OR vd.visit.dateTime >= :startDate)" +
            " AND (cast(:endDate AS timestamp) IS NULL OR vd.visit.dateTime <= :endDate)" +
            " GROUP BY vd.visitDetailsStatus")
    List<Record> countWithStatus(Instant startDate, Instant endDate);

    @Query("SELECT new com.app.server.entity.related.Record(count(vd))" +
            " FROM VisitDetails vd" +
            " WHERE (cast(:startDate AS timestamp) IS NULL OR vd.visit.dateTime >= :startDate)" +
            " AND (cast(:endDate AS timestamp) IS NULL OR vd.visit.dateTime <= :endDate)")
    List<Record> countAll(Instant startDate, Instant endDate);

    @Query("SELECT new com.app.server.entity.related.Record(count(vd), vd.customer.organizationName, 'null')" +
            " FROM VisitDetails vd" +
            " WHERE (cast(:startDate AS timestamp) IS NULL OR vd.visit.dateTime >= :startDate)" +
            " AND (cast(:endDate AS timestamp) IS NULL OR vd.visit.dateTime <= :endDate)" +
            " GROUP BY vd.customer.organizationName")
    List<Record> countWithOrganization(Instant startDate, Instant endDate);

    @Query("SELECT new com.app.server.entity.related.Record(count(vd), 'null', concat(e.firstName, '', e.lastName))" +
            " FROM VisitDetails vd" +
            " INNER JOIN Visit v ON vd.visit.id = v.id" +
            " INNER JOIN Employee e ON v.employee.id = e.id" +
            " WHERE (cast(:startDate AS timestamp) IS NULL OR vd.visit.dateTime >= :startDate)" +
            " AND (cast(:endDate AS timestamp) IS NULL OR vd.visit.dateTime <= :endDate)" +
            " GROUP BY e.id")
    List<Record> countWithEmployee(Instant startDate, Instant endDate);
}
