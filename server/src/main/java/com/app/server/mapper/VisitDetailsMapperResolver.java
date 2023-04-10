package com.app.server.mapper;

import com.app.server.dto.CustomerDto;
import com.app.server.dto.display.EmployeeDisplayDto;
import com.app.server.entity.Customer;
import com.app.server.entity.VisitDetails;
import com.app.server.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.ObjectFactory;
import org.mapstruct.TargetType;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class VisitDetailsMapperResolver {
    private final CustomerRepository customerRepository;
    private final EmployeeMapper employeeMapper;

    @ObjectFactory
    public Customer resolve(CustomerDto dto, @TargetType Class<Customer> type) {
        if (dto != null) {
            Optional<Customer> customer = customerRepository.findById(dto.getId());
            if (customer.isPresent())
                return customer.get();
        }
        return new Customer();
    }
    
    EmployeeDisplayDto getEmployee(VisitDetails entity) {
        return employeeMapper.asDisplayDto(entity.getVisit().getEmployee());
    }
}
