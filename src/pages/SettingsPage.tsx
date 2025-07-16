import { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';

function SettingsPage() {
  const { clearCompleted, clearAll } = useTodoContext();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ja');

  const handleClearCompleted = () => {
    clearCompleted();
    alert('Completed tasks have been cleared');
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
      clearAll();
      alert('All tasks have been cleared');
    }
  };

  const handleExportData = () => {
    const data = localStorage.getItem('todos');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'todos-backup.json';
      a.click();
      URL.revokeObjectURL(url);
      alert('Data exported successfully');
    } else {
      alert('No data to export');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ja">Japanese</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-700">Clear Completed Tasks</div>
              <div className="text-sm text-gray-500">Remove all completed tasks from your list</div>
            </div>
            <button
              type="button"
              onClick={handleClearCompleted}
              className="px-4 py-2 text-sm font-medium text-orange-700 bg-white border border-orange-300 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Clear Completed
            </button>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-700">Clear All Tasks</div>
              <div className="text-sm text-gray-500">
                Remove all tasks from your list (cannot be undone)
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Clear All
            </button>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-700">Export Data</div>
              <div className="text-sm text-gray-500">Download a backup of your tasks</div>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
        <div className="text-sm text-gray-500">
          TODO App v1.0.0 - Built with React, TypeScript, and Tailwind CSS
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
