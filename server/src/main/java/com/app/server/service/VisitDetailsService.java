package com.app.server.service;

import com.app.server.dto.VisitDetailsDto;
import com.app.server.dto.display.VisitDetailsDisplayDto;
import com.app.server.entity.Visit;
import com.app.server.entity.VisitDetails;
import com.app.server.entity.related.VisitDetailsStatus;
import com.app.server.mapper.VisitDetailsMapper;
import com.app.server.repository.VisitDetailsRepository;
import com.app.server.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VisitDetailsService {
    private final VisitDetailsMapper mapper;
    private final VisitService visitService;
    private final VisitDetailsRepository repository;
    private final VisitRepository visitRepository;

    public VisitDetails save(VisitDetailsDto visitDetailsDto, Instant dateTime, int employeeId) {
        Visit visit = this.visitService.getVisit(dateTime, employeeId);
        VisitDetails visitDetails = mapper.asEntity(visitDetailsDto);
        visit.addVisitDetails(visitDetails);
        this.visitRepository.save(visit);
        return repository.findByCustomerIdAndVisitId(visitDetailsDto.getCustomer().getId(), visit.getId()).orElseThrow();
    }

    public VisitDetails update(int id, VisitDetailsDto visitDetailsDto) {
        Optional<VisitDetails> existingVisitDetails = repository.findById(id);
        if (existingVisitDetails.isPresent()) {
            VisitDetails visitDetails = existingVisitDetails.get();
            visitDetails.setVisitDetailsStatus(visitDetailsDto.getStatus());
            visitDetails.setComment(visitDetailsDto.getComment());
            int employeeId = visitDetailsDto.getSubstitutingEmployeeId();
            if (visitDetailsDto.getSubstitutingEmployeeId() != 0) {
                if (visitDetails.getSubstitution() == null
                        || visitDetails.getSubstitution().getVisit().getEmployee().getId() != employeeId)
                    visitDetails.setSubstitution(createSubstitution(visitDetailsDto, visitDetails, employeeId));
            }
            return repository.save(visitDetails);
        }
        return null;
    }

    private VisitDetails createSubstitution(VisitDetailsDto visitDetailsDto, VisitDetails visitDetails,
                                            int substitutingEmployeeId) {
        VisitDetailsDto substitution = new VisitDetailsDto(VisitDetailsStatus.PRESENT, null,
                visitDetailsDto.getCustomer(), 0);
        return save(substitution, visitDetails.getVisit().getDateTime(), substitutingEmployeeId);
    }

    public VisitDetailsDisplayDto getDisplayDto(VisitDetails visitDetails) {
        return mapper.asDisplayDto(visitDetails);
    }
}
