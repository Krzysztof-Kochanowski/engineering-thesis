package com.app.server.controller;

import com.app.server.dto.SheetInfoDto;
import com.app.server.dto.display.SheetDisplayDto;
import com.app.server.service.SheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sheet")
public class SheetController {
    private final SheetService sheetService;

    @GetMapping
    ResponseEntity<List<SheetDisplayDto>> getSheets () {
        return ResponseEntity.ok(sheetService.findAll());
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> uploadExcelFile(@RequestPart MultipartFile file,
                                             @RequestPart SheetInfoDto sheetInfo) {
            try {
                sheetService.processExcelFile(file.getInputStream(), file.getOriginalFilename(), sheetInfo);
                return ResponseEntity.status(HttpStatus.OK).build();
            } catch (Exception e) {
                if (e instanceof DataIntegrityViolationException) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Wybrany arkusz już istnieje");
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
    }
}
