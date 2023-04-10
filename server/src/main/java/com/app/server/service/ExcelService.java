package com.app.server.service;

import com.app.server.exception.EmptyCellException;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Row.MissingCellPolicy;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ExcelService {
    public String getCell(Row row, int cellIdx) {
        return new DataFormatter().formatCellValue(row.getCell(cellIdx, MissingCellPolicy.CREATE_NULL_AS_BLANK));
    }

    public LocalTime getTimeCell(Row row, int cellIdx) {
        Cell cell = row.getCell(cellIdx, MissingCellPolicy.CREATE_NULL_AS_BLANK);
        if (cell.getCellType() == CellType.BLANK) {
            throw new EmptyCellException("Znaleziono pustą komórkę; rząd "
                    + row.getRowNum()
                    + " kolumna "
                    + cellIdx);
        }
        return cell.getLocalDateTimeCellValue().toLocalTime();
    }

    public Sheet getExcelSheet(InputStream stream) {
        try {
            Workbook workbook = new XSSFWorkbook(stream);
            Sheet excelSheet = workbook.getSheetAt(0);
            workbook.close();
            return excelSheet;
        } catch (IOException e) {
            throw new RuntimeException("Nie udało się odczytać pliku: " + e.getMessage());
        }
    }

    public String[] getAdjacentCellValues(Row row, int idx, int cellCount) {
        String[] adjacentCellValues = new String[cellCount];
        for (int i = 0; i < cellCount; i++) {
            adjacentCellValues[i] = getCell(row, idx + i + 1);
        }
        return adjacentCellValues;
    }

    public void throwEmptyCellException(Row row, int idx, String[] adjacentCellValues, int idxOffset) throws EmptyCellException {
        StringBuilder emptyCellIndices = new StringBuilder();
        for (int i = 0; i < adjacentCellValues.length; i++) {
            if (adjacentCellValues[i].length() == 0) {
                emptyCellIndices.append(idx + i + idxOffset);
                emptyCellIndices.append(",");
            }
        }
        throw new EmptyCellException("Znaleziono puste komórki; rząd "
                + row.getRowNum()
                + " kolumny "
                + emptyCellIndices.substring(0, emptyCellIndices.length() - 1)
        );
    }
}
