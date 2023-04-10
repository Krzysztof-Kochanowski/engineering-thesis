package com.app.server.mapper;

import com.app.server.dto.EmployeeAbsenceDto;
import com.app.server.dto.display.EmployeeAbsenceDisplayDto;
import com.app.server.entity.EmployeeAbsence;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {EmployeeAbsenceMapperResolver.class})
public interface EmployeeAbsenceMapper {
    EmployeeAbsenceDisplayDto asDisplayDto(EmployeeAbsence employeeAbsence);
    List<EmployeeAbsenceDisplayDto> asDisplayDtoList(List<EmployeeAbsence> entityList);

    EmployeeAbsence asEntity(EmployeeAbsenceDto dto);
}
