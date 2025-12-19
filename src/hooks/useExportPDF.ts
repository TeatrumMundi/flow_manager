"use client";

import { domToPng } from "modern-screenshot";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

interface UseExportPDFOptions {
  filename?: string;
  scale?: number;
  backgroundColor?: string;
  dateFrom?: string;
  dateTo?: string;
}

function formatMonthYear(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const monthNames = [
    "Sty",
    "Lut",
    "Mar",
    "Kwi",
    "Maj",
    "Cze",
    "Lip",
    "Sie",
    "Wrz",
    "Paz",
    "Lis",
    "Gru",
  ];
  const monthIndex = Number.parseInt(month, 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
}

export function useExportPDF(options: UseExportPDFOptions = {}) {
  const {
    filename = "export",
    scale = 2,
    backgroundColor = "#ffffff",
    dateFrom,
    dateTo,
  } = options;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(async () => {
    if (!contentRef.current) {
      toast.error("Nie można znaleźć zawartości do eksportu");
      return;
    }

    setIsExporting(true);
    const loadingToast = toast.loading("Generowanie PDF...");

    try {
      // Capture the content as PNG using modern-screenshot
      const imgData = await domToPng(contentRef.current, {
        scale,
        backgroundColor,
        quality: 1,
      });

      if (!imgData) {
        throw new Error("Failed to capture content");
      }

      // Convert data URL to Uint8Array
      const base64Data = imgData.split(",")[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      const pngImage = await pdfDoc.embedPng(bytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // A4 dimensions in points (72 points per inch)
      const a4Width = 595.28;
      const a4Height = 841.89;
      const padding = 40;
      const headerHeight = 60;

      // Calculate scaling to fit image within page (accounting for header)
      const maxWidth = a4Width - padding * 2;
      const maxHeight = a4Height - padding * 2 - headerHeight;

      const imgAspectRatio = pngImage.width / pngImage.height;
      const pageAspectRatio = maxWidth / maxHeight;

      let scaledWidth: number;
      let scaledHeight: number;

      if (imgAspectRatio > pageAspectRatio) {
        // Image is wider than page ratio
        scaledWidth = maxWidth;
        scaledHeight = maxWidth / imgAspectRatio;
      } else {
        // Image is taller than page ratio
        scaledHeight = maxHeight;
        scaledWidth = maxHeight * imgAspectRatio;
      }

      // Add page and draw image
      const page = pdfDoc.addPage([a4Width, a4Height]);

      // Draw header with title
      const titleFontSize = 18;
      const titleWidth = fontBold.widthOfTextAtSize(filename, titleFontSize);
      page.drawText(filename, {
        x: (a4Width - titleWidth) / 2,
        y: a4Height - padding - 20,
        size: titleFontSize,
        font: fontBold,
        color: rgb(0.12, 0.16, 0.22),
      });

      // Draw date range
      if (dateFrom && dateTo) {
        const dateRangeText = `Zakres: ${formatMonthYear(dateFrom)} - ${formatMonthYear(dateTo)}`;
        const dateRangeFontSize = 11;
        const dateRangeWidth = font.widthOfTextAtSize(
          dateRangeText,
          dateRangeFontSize,
        );
        page.drawText(dateRangeText, {
          x: (a4Width - dateRangeWidth) / 2,
          y: a4Height - padding - 40,
          size: dateRangeFontSize,
          font: font,
          color: rgb(0.42, 0.45, 0.5),
        });
      }

      // Draw image below header
      const x = (a4Width - scaledWidth) / 2;
      const y = a4Height - padding - headerHeight - scaledHeight;

      page.drawImage(pngImage, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });

      // Generate PDF bytes and download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);

      // Create download link with date range in filename
      const dateRangeForFilename =
        dateFrom && dateTo ? `_${dateFrom}_${dateTo}` : "";
      const downloadFilename = `${filename}${dateRangeForFilename}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success("PDF został pobrany");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.dismiss(loadingToast);
      toast.error("Wystąpił błąd podczas generowania PDF");
    } finally {
      setIsExporting(false);
    }
  }, [filename, scale, backgroundColor, dateFrom, dateTo]);

  return {
    contentRef,
    exportToPDF,
    isExporting,
  };
}
