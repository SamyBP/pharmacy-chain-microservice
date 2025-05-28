import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { getExportFilename } from '@/utils';

export interface FileService {
  export: <T>(items: T[], filename?: string) => void;
}

class CsvFileService implements FileService {
  export<T>(items: T[], filename: string = getExportFilename()): void {
    if (!items.length) return;

    const headers = Object.keys(items[0] as object);

    const csvRows = [
      headers.join(','),
      ...items.map(item =>
        headers.map(header =>
          this.escapeCSV(String((item as any)[header]))
        ).join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  }

  private escapeCSV(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }
}

class DocxFileService implements FileService {
  export<T>(items: T[], filename: string = getExportFilename()): void {
    if (!items.length) return;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          this.createTitle(filename),
          this.createTable(items)
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${filename}.docx`);
    });
  }

  private createTitle(title: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: title.charAt(0).toUpperCase() + title.slice(1),
          bold: true,
          size: 32
        })
      ],
      spacing: {
        after: 200
      }
    });
  }

  private createTable<T>(items: T[]): Table {
    const headers = Object.keys(items[0] as object);
    const columnCount = headers.length;
    const columnWidth = Math.floor(10000 / columnCount);

    const createHeaderCell = (text: string) =>
      new TableCell({
        width: { size: columnWidth, type: WidthType.DXA },
        children: [
          new Paragraph({
            children: [new TextRun({ text, bold: true })]
          })
        ]
      });

    const createDataCell = (text: string) =>
      new TableCell({
        width: { size: columnWidth, type: WidthType.DXA },
        children: [
          new Paragraph({
            children: [new TextRun({ text })]
          })
        ]
      });

    return new Table({
      width: {
        size: 10000,
        type: WidthType.DXA
      },
      rows: [
        new TableRow({
          children: headers.map(header => createHeaderCell(header))
        }),
        ...items.map(item =>
          new TableRow({
            children: headers.map(header =>
              createDataCell(String((item as any)[header]))
            )
          })
        )
      ]
    });
  }
}

export const csvFileService = new CsvFileService();
export const docxFileService = new DocxFileService();