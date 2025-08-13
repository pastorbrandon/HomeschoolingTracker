'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { Child, Subject } from '@/lib/types';
import { useHomeSchoolStore } from '@/lib/store';

interface ChildCardProps {
  child: Child;
  subjects: Subject[];
  todayRecords: { [key: string]: boolean };
  onToggleRecord: (childId: string, subjectId: string) => void;
}

export default function ChildCard({ 
  child, 
  subjects, 
  todayRecords, 
  onToggleRecord 
}: ChildCardProps) {
  const completedSubjects = subjects.filter(subject => 
    todayRecords[`${child.id}-${subject.id}`]
  ).length;

  const totalSubjects = subjects.length;
  const progressPercentage = totalSubjects > 0 ? (completedSubjects / totalSubjects) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{child.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {completedSubjects}/{totalSubjects} completed
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Subjects grid */}
      <div className="grid grid-cols-2 gap-3">
        {subjects.map((subject) => {
          const isCompleted = todayRecords[`${child.id}-${subject.id}`];
          return (
            <button
              key={subject.id}
              onClick={() => onToggleRecord(child.id, subject.id)}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                ${isCompleted 
                  ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' 
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-sm font-medium">{subject.name}</span>
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center
                ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
              `}>
                {isCompleted ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <X className="w-3 h-3 text-gray-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Status indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Today's Status:</span>
          <span className={`
            text-sm font-medium px-2 py-1 rounded-full
            ${completedSubjects > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
            }
          `}>
            {completedSubjects > 0 ? 'Present' : 'Absent'}
          </span>
        </div>
      </div>
    </div>
  );
}
