package com.app.server.service;

import com.app.server.dto.CustomerAbsenceDto;
import com.app.server.dto.display.CustomerAbsenceDisplayDto;
import com.app.server.entity.Customer;
import com.app.server.entity.CustomerAbsence;
import com.app.server.mapper.CustomerAbsenceMapper;
import com.app.server.repository.CustomerAbsenceRepository;
import com.app.server.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerAbsenceService {
    private final CustomerAbsenceMapper mapper;
    private final CustomerAbsenceRepository repository;
    private final CustomerRepository customerRepository;
    private final VisitService visitService;

    public List<CustomerAbsence> findAll(Optional<String> startDateTime, Optional<String> endDateTime) {
        Instant startDate = null;
        Instant endDate = null;
        if (startDateTime.isPresent()) {
            startDate = Instant.parse(startDateTime.get());
        }
        if (endDateTime.isPresent()) {
            endDate = Instant.parse(endDateTime.get());
        }
        return this.repository.findCustomerAbsences(startDate, endDate);
    }

    public CustomerAbsence save(CustomerAbsenceDto customerAbsenceDto) {
        Optional<Customer> customer = this.customerRepository.findById(customerAbsenceDto.getCustomer().getId());
        if (customer.isPresent()) {
            CustomerAbsence customerAbsence = this.mapper.asEntity(customerAbsenceDto);
            visitService.applyCustomerAbsence(customerAbsence.getCustomer().getId(), customerAbsence.getStartDate(), customerAbsence.getEndDate());
            return this.repository.save(customerAbsence);
        }
        return null;
    }

    public CustomerAbsence update(int id, CustomerAbsenceDisplayDto dto) {
        Optional<CustomerAbsence> existingCustomerAbsence = repository.findById(id);
        if (existingCustomerAbsence.isPresent()) {
            CustomerAbsence entity = existingCustomerAbsence.get();
            if (dto.getStartDate().isBefore(entity.getStartDate()))
                visitService.applyCustomerAbsence(entity.getCustomer().getId(), dto.getStartDate(), entity.getStartDate());
            else if (dto.getStartDate().isAfter(entity.getStartDate()))
                visitService.removeCustomerAbsence(entity.getCustomer().getId(), entity.getStartDate(), dto.getStartDate());
            if (dto.getEndDate().isBefore(entity.getEndDate()))
                visitService.removeCustomerAbsence(entity.getCustomer().getId(), dto.getEndDate(), entity.getEndDate());
            else if (dto.getEndDate().isAfter(entity.getEndDate()))
                visitService.applyCustomerAbsence(entity.getCustomer().getId(), entity.getEndDate(), dto.getEndDate());

            entity.setStartDate(dto.getStartDate());
            entity.setEndDate(dto.getEndDate());

            return repository.save(entity);
        }
        return null;
    }

    public boolean deleteCustomerAbsence(int id) {
        Optional<CustomerAbsence> existingCustomerAbsence = repository.findById(id);
        boolean exists = existingCustomerAbsence.isPresent();
        if (exists) {
            CustomerAbsence entity = existingCustomerAbsence.get();
            this.visitService.removeCustomerAbsence(entity.getCustomer().getId(), entity.getStartDate(), entity.getEndDate());
            this.repository.deleteById(id);
        }
        return exists;
    }

    public CustomerAbsenceDisplayDto getDisplayDto(CustomerAbsence customerAbsence) {
        return mapper.asDisplayDto(customerAbsence);
    }

    public List<CustomerAbsenceDisplayDto> getDisplayDto(List<CustomerAbsence> customerAbsences) {
        return this.mapper.asDisplayDtoList(customerAbsences);
    }
}
