'use client';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ChildCard from '@/components/ChildCard';
import { useHomeSchoolStore } from '@/lib/store';

export default function Dashboard() {
  const [today, setToday] = useState(dayjs().format('YYYY-MM-DD'));
  const { 
    children, 
    subjects, 
    todayRecords, 
    isLoading, 
    error,
    initialize, 
    loadTodayRecords, 
    toggleRecord 
  } = useHomeSchoolStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (children.length > 0) {
      loadTodayRecords(today);
    }
  }, [today, children, loadTodayRecords]);

  const handleToggleRecord = async (childId: string, subjectId: string) => {
    await toggleRecord(today, childId, subjectId);
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('dddd, MMMM D, YYYY');
  };

  const formatTime = () => {
    return dayjs().format('h:mm A');
  };

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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Today's Dashboard</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span className="text-lg font-medium">{formatDate(today)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-medium">{formatTime()}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600">
            Track your children's progress for today. Click on subjects to mark them as completed.
          </p>
        </div>

        {/* Children Grid */}
        {children.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No children added yet</h3>
            <p className="text-gray-600">Add children in the settings to start tracking their progress.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                subjects={subjects}
                todayRecords={todayRecords}
                onToggleRecord={handleToggleRecord}
              />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {children.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {children.filter(child => 
                    subjects.some(subject => todayRecords[`${child.id}-${subject.id}`])
                  ).length}
                </div>
                <div className="text-sm text-gray-600">Children Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(todayRecords).filter(Boolean).length}
                </div>
                <div className="text-sm text-gray-600">Subjects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((Object.values(todayRecords).filter(Boolean).length / (children.length * subjects.length)) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
