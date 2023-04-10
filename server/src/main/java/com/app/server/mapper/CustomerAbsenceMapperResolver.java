package com.app.server.mapper;

import com.app.server.dto.CustomerDto;
import com.app.server.entity.Customer;
import com.app.server.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.ObjectFactory;
import org.mapstruct.TargetType;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomerAbsenceMapperResolver {
    private final CustomerRepository customerRepository;

    @ObjectFactory
    public Customer resolve(CustomerDto dto, @TargetType Class<Customer> type) {
        if (dto != null) {
            Optional<Customer> customer = customerRepository.findById(dto.getId());
            if (customer.isPresent())
                return customer.get();
        }
        return new Customer();
    }
}
