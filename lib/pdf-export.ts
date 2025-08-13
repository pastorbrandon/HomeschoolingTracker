import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import { AttendanceSummary, Subject } from './types';

interface PdfExportOptions {
  title: string;
  dateRange: { startDate: string; endDate: string };
  exportTimestamp: string;
}

export const exportAttendanceSummary = (
  attendanceSummary: AttendanceSummary[],
  subjects: Subject[],
  options: PdfExportOptions
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('HomeSchool Tracker - Attendance Summary', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Date Range: ${dayjs(options.dateRange.startDate).format('MMM DD, YYYY')} - ${dayjs(options.dateRange.endDate).format('MMM DD, YYYY')}`, 20, 35);
  doc.text(`Exported: ${options.exportTimestamp}`, 20, 45);
  
  // Attendance summary table
  const tableData = attendanceSummary.map(summary => [
    summary.childName,
    summary.totalDays.toString(),
  ]);
  
  autoTable(doc, {
    startY: 60,
    head: [['Child', 'Total Attendance Days']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
    },
  });
  
  // Subject breakdown table
  const subjectTableData = attendanceSummary.flatMap(summary => {
    const childRows = subjects.map(subject => [
      summary.childName,
      subject.name,
      summary.subjectTotals[subject.id]?.toString() || '0',
    ]);
    return childRows;
  });
  
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Child', 'Subject', 'Days Completed']],
    body: subjectTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
    },
  });
  
  doc.save(`attendance-summary-${dayjs().format('YYYY-MM-DD-HHmm')}.pdf`);
};

export const exportSubjectSummary = (
  attendanceSummary: AttendanceSummary[],
  subjects: Subject[],
  options: PdfExportOptions
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('HomeSchool Tracker - Subject Summary', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Date Range: ${dayjs(options.dateRange.startDate).format('MMM DD, YYYY')} - ${dayjs(options.dateRange.endDate).format('MMM DD, YYYY')}`, 20, 35);
  doc.text(`Exported: ${options.exportTimestamp}`, 20, 45);
  
  // Subject summary table
  const tableData = subjects.map(subject => {
    const subjectTotals = attendanceSummary.map(summary => 
      summary.subjectTotals[subject.id] || 0
    );
    const total = subjectTotals.reduce((sum, count) => sum + count, 0);
    
    return [
      subject.name,
      ...subjectTotals.map(count => count.toString()),
      total.toString(),
    ];
  });
  
  const childNames = attendanceSummary.map(summary => summary.childName);
  
  autoTable(doc, {
    startY: 60,
    head: [['Subject', ...childNames, 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
    },
  });
  
  // Summary statistics
  const totalDays = attendanceSummary.reduce((sum, summary) => sum + summary.totalDays, 0);
  const avgDaysPerChild = totalDays / attendanceSummary.length;
  
  doc.setFontSize(12);
  doc.text(`Total School Days: ${totalDays}`, 20, doc.lastAutoTable.finalY + 20);
  doc.text(`Average Days per Child: ${avgDaysPerChild.toFixed(1)}`, 20, doc.lastAutoTable.finalY + 30);
  
  doc.save(`subject-summary-${dayjs().format('YYYY-MM-DD-HHmm')}.pdf`);
};

export const exportDetailedReport = (
  attendanceSummary: AttendanceSummary[],
  subjects: Subject[],
  options: PdfExportOptions
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('HomeSchool Tracker - Detailed Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Date Range: ${dayjs(options.dateRange.startDate).format('MMM DD, YYYY')} - ${dayjs(options.dateRange.endDate).format('MMM DD, YYYY')}`, 20, 35);
  doc.text(`Exported: ${options.exportTimestamp}`, 20, 45);
  
  let currentY = 60;
  
  // Individual child reports
  attendanceSummary.forEach((summary, index) => {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${summary.childName} - Summary`, 20, currentY);
    currentY += 15;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Attendance Days: ${summary.totalDays}`, 20, currentY);
    currentY += 10;
    
    // Subject breakdown for this child
    const childSubjectData = subjects.map(subject => [
      subject.name,
      (summary.subjectTotals[subject.id] || 0).toString(),
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Subject', 'Days Completed']],
      body: childSubjectData,
      theme: 'grid',
      headStyles: {
        fillColor: [107, 114, 128],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
      },
    });
    
    currentY = doc.lastAutoTable.finalY + 20;
  });
  
  doc.save(`detailed-report-${dayjs().format('YYYY-MM-DD-HHmm')}.pdf`);
};
