package com.app.server.mapper;

import com.app.server.dto.VisitDetailsDto;
import com.app.server.dto.display.VisitDetailsDisplayDto;
import com.app.server.entity.VisitDetails;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        uses = {VisitDetailsMapperResolver.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface VisitDetailsMapper {
    @Mapping(source = "visitDetailsStatus", target = "status")
    @Mapping(expression="java(asDisplayDto(entity.getSubstitution()))", target = "substitution")
    @Mapping(expression="java(visitDetailsMapperResolver.getEmployee(entity))", target = "employee")
    VisitDetailsDisplayDto asDisplayDto(VisitDetails entity);
    List<VisitDetailsDisplayDto> asDisplayDtoList(List<VisitDetails> entityList);
    @Mapping(source = "status", target = "visitDetailsStatus")
    VisitDetails asEntity(VisitDetailsDto dto);
}
