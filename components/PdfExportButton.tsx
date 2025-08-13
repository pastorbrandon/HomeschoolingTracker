'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';
import dayjs from 'dayjs';

interface PdfExportButtonProps {
  onExport: () => void;
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export default function PdfExportButton({
  onExport,
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
}: PdfExportButtonProps) {
  const baseClasses = "inline-flex items-center px-4 py-2 border rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400",
    secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
  };

  return (
    <button
      onClick={onExport}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      ) : (
        <FileText className="w-4 h-4 mr-2" />
      )}
      {label}
    </button>
  );
}

export function ExportButtonGroup({ 
  onAttendanceExport, 
  onSubjectExport, 
  onDetailedExport,
  disabled = false,
  loading = false 
}: {
  onAttendanceExport: () => void;
  onSubjectExport: () => void;
  onDetailedExport: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <PdfExportButton
        onExport={onAttendanceExport}
        label="Attendance Summary"
        variant="primary"
        disabled={disabled}
        loading={loading}
      />
      <PdfExportButton
        onExport={onSubjectExport}
        label="Subject Summary"
        variant="secondary"
        disabled={disabled}
        loading={loading}
      />
      <PdfExportButton
        onExport={onDetailedExport}
        label="Detailed Report"
        variant="secondary"
        disabled={disabled}
        loading={loading}
      />
    </div>
  );
}
