package com.app.server.mapper;

import com.app.server.dto.EmployeeDto;
import com.app.server.dto.display.EmployeeDisplayDto;
import com.app.server.entity.Employee;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface EmployeeMapper {
    EmployeeDisplayDto asDisplayDto(Employee employee);
    List<EmployeeDisplayDto> asDisplayDtoList(List<Employee> entityList);

    Employee asEntity(EmployeeDto dto);
}
