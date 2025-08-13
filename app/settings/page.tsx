'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Users, BookOpen, Calendar, Trash2, Plus, Edit2, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useHomeSchoolStore } from '@/lib/store';
import { Child, Subject, SchoolYear } from '@/lib/types';

export default function SettingsPage() {
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [newChildName, setNewChildName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const { 
    children, 
    subjects, 
    schoolYear,
    isLoading, 
    error,
    initialize, 
    addChild, 
    updateChild, 
    deleteChild,
    addSubject, 
    updateSubject, 
    deleteSubject,
    updateSchoolYear,
    clearAllData 
  } = useHomeSchoolStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleAddChild = async () => {
    if (newChildName.trim()) {
      await addChild(newChildName.trim());
      setNewChildName('');
    }
  };

  const handleUpdateChild = async () => {
    if (editingChild && editingChild.name.trim()) {
      await updateChild(editingChild);
      setEditingChild(null);
    }
  };

  const handleDeleteChild = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this child? This will also delete all their records.')) {
      await deleteChild(id);
    }
  };

  const handleAddSubject = async () => {
    if (newSubjectName.trim()) {
      await addSubject(newSubjectName.trim());
      setNewSubjectName('');
    }
  };

  const handleUpdateSubject = async () => {
    if (editingSubject && editingSubject.name.trim()) {
      await updateSubject(editingSubject);
      setEditingSubject(null);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject? This will also delete all related records.')) {
      await deleteSubject(id);
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone and will reset everything to defaults.')) {
      await clearAllData();
      setShowClearConfirm(false);
    }
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
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your children, subjects, and school year settings. All changes are saved automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Children Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Children</h2>
            </div>

            {/* Add new child */}
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Enter child's name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddChild()}
              />
              <button
                onClick={handleAddChild}
                disabled={!newChildName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Children list */}
            <div className="space-y-3">
              {children.map((child) => (
                <div key={child.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  {editingChild?.id === child.id ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={editingChild.name}
                        onChange={(e) => setEditingChild({ ...editingChild, name: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={handleUpdateChild}
                        className="p-1 text-green-600 hover:text-green-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingChild(null)}
                        className="p-1 text-gray-600 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">{child.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingChild(child)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteChild(child.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subjects Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Subjects</h2>
            </div>

            {/* Add new subject */}
            <div className="flex space-x-2 mb-6">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Enter subject name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
              />
              <button
                onClick={handleAddSubject}
                disabled={!newSubjectName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Subjects list */}
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  {editingSubject?.id === subject.id ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={editingSubject.name}
                        onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={handleUpdateSubject}
                        className="p-1 text-green-600 hover:text-green-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingSubject(null)}
                        className="p-1 text-gray-600 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">{subject.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingSubject(subject)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* School Year Settings */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">School Year</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                School Year Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={schoolYear?.startDate || ''}
                onChange={(e) => schoolYear && updateSchoolYear({ ...schoolYear, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                School Year End Date
              </label>
              <input
                type="date"
                id="end-date"
                value={schoolYear?.endDate || ''}
                onChange={(e) => schoolYear && updateSchoolYear({ ...schoolYear, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-red-800">Data Management</h2>
          </div>
          
          <p className="text-red-700 mb-4">
            Warning: Clearing all data will permanently delete all children, subjects, and attendance records. 
            This action cannot be undone.
          </p>
          
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Clear All Data
          </button>
        </div>

        {/* Clear confirmation modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Data Clear</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete all data and reset to default settings. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleClearAllData}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Clear All Data
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
