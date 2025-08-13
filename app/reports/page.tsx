'use client';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';
import Navigation from '@/components/Navigation';
import DateRangePicker from '@/components/DateRangePicker';
import { ExportButtonGroup } from '@/components/PdfExportButton';
import { useHomeSchoolStore } from '@/lib/store';
import { exportAttendanceSummary, exportSubjectSummary, exportDetailedReport } from '@/lib/pdf-export';

export default function Reports() {
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [exportLoading, setExportLoading] = useState(false);
  
  const { 
    children, 
    subjects, 
    attendanceSummary, 
    schoolYear,
    isLoading, 
    error,
    initialize, 
    loadAttendanceSummary 
  } = useHomeSchoolStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (children.length > 0) {
      loadAttendanceSummary(startDate, endDate);
    }
  }, [startDate, endDate, children, loadAttendanceSummary]);

  const handleAttendanceExport = async () => {
    setExportLoading(true);
    try {
      const options = {
        title: 'Attendance Summary',
        dateRange: { startDate, endDate },
        exportTimestamp: dayjs().format('MMM DD, YYYY h:mm A'),
      };
      exportAttendanceSummary(attendanceSummary, subjects, options);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleSubjectExport = async () => {
    setExportLoading(true);
    try {
      const options = {
        title: 'Subject Summary',
        dateRange: { startDate, endDate },
        exportTimestamp: dayjs().format('MMM DD, YYYY h:mm A'),
      };
      exportSubjectSummary(attendanceSummary, subjects, options);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleDetailedExport = async () => {
    setExportLoading(true);
    try {
      const options = {
        title: 'Detailed Report',
        dateRange: { startDate, endDate },
        exportTimestamp: dayjs().format('MMM DD, YYYY h:mm A'),
      };
      exportDetailedReport(attendanceSummary, subjects, options);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const totalDays = attendanceSummary.reduce((sum, summary) => sum + summary.totalDays, 0);
  const avgDaysPerChild = attendanceSummary.length > 0 ? totalDays / attendanceSummary.length : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          </div>
          <p className="text-gray-600">
            View attendance summaries and subject progress for any date range. Export reports for record keeping.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Date Range Picker */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Total Children</p>
                      <p className="text-2xl font-bold text-blue-900">{children.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Total School Days</p>
                      <p className="text-2xl font-bold text-green-900">{totalDays}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600">Avg Days/Child</p>
                      <p className="text-2xl font-bold text-purple-900">{avgDaysPerChild.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Export Reports</h3>
                <ExportButtonGroup
                  onAttendanceExport={handleAttendanceExport}
                  onSubjectExport={handleSubjectExport}
                  onDetailedExport={handleDetailedExport}
                  disabled={attendanceSummary.length === 0}
                  loading={exportLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary Table */}
        {attendanceSummary.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Attendance Summary</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Child
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Days
                    </th>
                    {subjects.map((subject) => (
                      <th key={subject.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {subject.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceSummary.map((summary) => (
                    <tr key={summary.childId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {summary.childName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {summary.totalDays}
                        </span>
                      </td>
                      {subjects.map((subject) => (
                        <td key={subject.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {summary.subjectTotals[subject.id] || 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {children.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data to display</h3>
            <p className="text-gray-600">Add children and start tracking their progress to see reports here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
