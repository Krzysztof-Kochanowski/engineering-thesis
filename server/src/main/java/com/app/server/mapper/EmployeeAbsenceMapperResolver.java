package com.app.server.mapper;

import com.app.server.dto.EmployeeDto;
import com.app.server.entity.Employee;
import com.app.server.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.ObjectFactory;
import org.mapstruct.TargetType;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class EmployeeAbsenceMapperResolver {
    private final EmployeeRepository employeeRepository;

    @ObjectFactory
    public Employee resolve(EmployeeDto dto, @TargetType Class<Employee> type) {
        if (dto != null) {
            Optional<Employee> employee = employeeRepository.findById(dto.getId());
            if (employee.isPresent())
                return employee.get();
        }
        return new Employee();
    }
}
