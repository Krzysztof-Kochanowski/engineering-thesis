package com.app.server.service;

import com.app.server.dto.EmployeeAbsenceDto;
import com.app.server.dto.display.EmployeeAbsenceDisplayDto;
import com.app.server.entity.Employee;
import com.app.server.entity.EmployeeAbsence;
import com.app.server.mapper.EmployeeAbsenceMapper;
import com.app.server.repository.EmployeeAbsenceRepository;
import com.app.server.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeAbsenceService {
    private final EmployeeAbsenceMapper mapper;
    private final EmployeeAbsenceRepository repository;
    private final EmployeeRepository employeeRepository;
    private final VisitService visitService;

    public List<EmployeeAbsence> findAll(Optional<Integer> employeeId, Optional<String> startDateTime, Optional<String> endDateTime) {
        Instant startDate = null;
        Instant endDate = null;
        if (startDateTime.isPresent()) {
            startDate = Instant.parse(startDateTime.get());
        }
        if (endDateTime.isPresent()) {
            endDate = Instant.parse(endDateTime.get());
        }
        return this.repository.findEmployeeAbsences(employeeId.orElse(null) , startDate, endDate);
    }

    public EmployeeAbsence save(EmployeeAbsenceDto employeeAbsenceDto) {
        Optional<Employee> employee = this.employeeRepository.findById(employeeAbsenceDto.getEmployee().getId());
        if (employee.isPresent() && !this.overlappingAbsenceExists(employeeAbsenceDto)) {
            EmployeeAbsence employeeAbsence = this.mapper.asEntity(employeeAbsenceDto);
            visitService.applyEmployeeAbsence(employeeAbsence.getEmployee().getId(), employeeAbsence.getStartDate(), employeeAbsence.getEndDate());
            return this.repository.save(employeeAbsence);
        }
        return null;
    }

    public EmployeeAbsence update(int id, EmployeeAbsenceDisplayDto dto) {

        Optional<EmployeeAbsence> existingEmployeeAbsence = repository.findById(id);
        if (existingEmployeeAbsence.isPresent() && !this.overlappingAbsenceExists(existingEmployeeAbsence.get(), dto)) {
            EmployeeAbsence entity = existingEmployeeAbsence.get();
            if (dto.getStartDate().isBefore(entity.getStartDate()))
                visitService.applyEmployeeAbsence(entity.getEmployee().getId(), dto.getStartDate(), entity.getStartDate());
            else if (dto.getStartDate().isAfter(entity.getStartDate()))
                visitService.removeEmployeeAbsence(entity.getEmployee().getId(), entity.getStartDate(), dto.getStartDate());
            if (dto.getEndDate().isBefore(entity.getEndDate()))
                visitService.removeEmployeeAbsence(entity.getEmployee().getId(), dto.getEndDate(), entity.getEndDate());
            else if (dto.getEndDate().isAfter(entity.getEndDate()))
                visitService.applyEmployeeAbsence(entity.getEmployee().getId(), entity.getEndDate(), dto.getEndDate());


            entity.setStartDate(dto.getStartDate());
            entity.setEndDate(dto.getEndDate());

            return repository.save(entity);
        }
        return null;
    }

    private boolean overlappingAbsenceExists(EmployeeAbsence employeeAbsence, EmployeeAbsenceDisplayDto dto) {
        List<EmployeeAbsence> overlapping = this.repository.findOverlappingAbsences(
                employeeAbsence.getEmployee().getId(),
                dto.getStartDate(),
                dto.getEndDate(),
                employeeAbsence.getId()
        );

        return overlapping.size() > 0;
    }

    private boolean overlappingAbsenceExists(EmployeeAbsenceDto dto) {
        List<EmployeeAbsence> overlapping = this.repository.findOverlappingAbsences(
                dto.getEmployee().getId(),
                dto.getStartDate(),
                dto.getEndDate(),
                -1
        );
        return overlapping.size() > 0;
    }

    public boolean deleteEmployeeAbsence(int id) {
        Optional<EmployeeAbsence> existingEmployeeAbsence = repository.findById(id);
        boolean exists = existingEmployeeAbsence.isPresent();
        if (exists) {
            EmployeeAbsence entity = existingEmployeeAbsence.get();
            this.visitService.removeEmployeeAbsence(entity.getEmployee().getId(), entity.getStartDate(), entity.getEndDate());
            this.repository.deleteById(id);
        }
        return exists;
    }

    public EmployeeAbsenceDisplayDto getDisplayDto(EmployeeAbsence employeeAbsence) {
        return mapper.asDisplayDto(employeeAbsence);
    }

    public List<EmployeeAbsenceDisplayDto> getDisplayDto(List<EmployeeAbsence> employeeAbsences) {
        return this.mapper.asDisplayDtoList(employeeAbsences);
    }
}
