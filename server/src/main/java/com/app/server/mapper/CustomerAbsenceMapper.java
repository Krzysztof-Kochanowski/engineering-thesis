package com.app.server.mapper;

import com.app.server.dto.CustomerAbsenceDto;
import com.app.server.dto.display.CustomerAbsenceDisplayDto;
import com.app.server.entity.CustomerAbsence;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {CustomerAbsenceMapperResolver.class})
public interface CustomerAbsenceMapper {
    CustomerAbsenceDisplayDto asDisplayDto(CustomerAbsence customerAbsence);
    List<CustomerAbsenceDisplayDto> asDisplayDtoList(List<CustomerAbsence> entityList);

    CustomerAbsence asEntity(CustomerAbsenceDto dto);
}