'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import dayjs from 'dayjs';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = '',
}: DateRangePickerProps) {
  const currentYear = new Date().getFullYear();
  
  const presetRanges = [
    {
      label: 'Current School Year',
      start: `${currentYear}-09-01`,
      end: `${currentYear + 1}-06-30`,
    },
    {
      label: 'Last 30 Days',
      start: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD'),
    },
    {
      label: 'Last 90 Days',
      start: dayjs().subtract(90, 'day').format('YYYY-MM-DD'),
      end: dayjs().format('YYYY-MM-DD'),
    },
    {
      label: 'This Month',
      start: dayjs().startOf('month').format('YYYY-MM-DD'),
      end: dayjs().endOf('month').format('YYYY-MM-DD'),
    },
  ];

  const handlePresetClick = (start: string, end: string) => {
    onStartDateChange(start);
    onEndDateChange(end);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-800">Date Range</h3>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {presetRanges.map((preset, index) => (
          <button
            key={index}
            onClick={() => handlePresetClick(preset.start, preset.end)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom date inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Date range display */}
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Selected Range:</span>{' '}
          {dayjs(startDate).format('MMM DD, YYYY')} - {dayjs(endDate).format('MMM DD, YYYY')}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {dayjs(endDate).diff(dayjs(startDate), 'day') + 1} days total
        </p>
      </div>
    </div>
  );
}
