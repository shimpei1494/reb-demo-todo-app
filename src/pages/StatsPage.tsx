import { useTodoContext } from '../context/TodoContext';
import type { TodoStats } from '../types/todo';

function StatsPage() {
  const { getTodoStats } = useTodoContext();
  const stats: TodoStats = getTodoStats();

  const getProgressColor = (rate: number) => {
    if (rate > 70) return 'bg-green-500';
    if (rate > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Total TODOs</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {stats.completionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">Completion Rate</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
          <div
            className={`h-6 rounded-full ${getProgressColor(stats.completionRate)}`}
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <div className="text-sm text-gray-500">
          {stats.completed} of {stats.total} tasks completed
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                High
              </span>
              <span className="text-sm text-gray-700">{stats.byPriority.high} tasks</span>
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{
                  width: `${stats.total > 0 ? (stats.byPriority.high / stats.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Medium
              </span>
              <span className="text-sm text-gray-700">{stats.byPriority.medium} tasks</span>
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{
                  width: `${stats.total > 0 ? (stats.byPriority.medium / stats.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Low
              </span>
              <span className="text-sm text-gray-700">{stats.byPriority.low} tasks</span>
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${stats.total > 0 ? (stats.byPriority.low / stats.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
