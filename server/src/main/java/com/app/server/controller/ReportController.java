package com.app.server.controller;

import com.app.server.dto.ReportDto;
import com.app.server.entity.related.Record;
import com.app.server.service.AwsService;
import com.app.server.service.ReportService;
import com.app.server.util.ReportGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/report")
@PreAuthorize("hasRole('STAFF')")
public class ReportController {
    private final ReportService service;
    private final AwsService awsService;

    @GetMapping
    public ResponseEntity<List<String>> getReports() {
        return ResponseEntity.ok(awsService.getObjectSummaries());
    }

    @GetMapping ("/{fileName}")
    public ResponseEntity<Resource> getReport(@PathVariable final String fileName) {
        try {
            byte[] bytes = awsService.getObject(fileName);
            ByteArrayResource resource = new ByteArrayResource(bytes);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.attachment().filename(fileName).build().toString())
                    .contentLength(bytes.length)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(resource);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<Resource> exportIntoExcelFile(
            @RequestBody final ReportDto reportDto
    ) {
        List<Record> recordList = service.getReport(reportDto.getStartDate(), reportDto.getEndDate(), reportDto.getReportOptions());
        ReportGenerator generator = new ReportGenerator(recordList, "Raport", reportDto.getReportOptions(), reportDto.getReportHeaders());

        try {
            byte[] bytes = generator.generateExcelFile(awsService);
            ByteArrayResource resource = new ByteArrayResource(bytes);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.attachment().filename(generator.getFileName()).build().toString())
                    .contentLength(bytes.length)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(resource);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
