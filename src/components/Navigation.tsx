import { IconChartBar, IconList, IconSettings } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    switch (location.pathname) {
      case '/':
        return 'todos';
      case '/stats':
        return 'stats';
      case '/settings':
        return 'settings';
      default:
        return 'todos';
    }
  };

  const handleTabClick = (tab: string) => {
    switch (tab) {
      case 'todos':
        navigate('/');
        break;
      case 'stats':
        navigate('/stats');
        break;
      case 'settings':
        navigate('/settings');
        break;
    }
  };

  const activeTab = getActiveTab();

  return (
    <div className="flex justify-between items-center h-16 px-4">
      <h1 className="text-xl font-bold text-gray-900">TODO App</h1>
      <nav className="flex space-x-1">
        <button
          type="button"
          onClick={() => handleTabClick('todos')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'todos'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <IconList size={16} />
          <span>TODOs</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('stats')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'stats'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <IconChartBar size={16} />
          <span>Stats</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('settings')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <IconSettings size={16} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default Navigation;
