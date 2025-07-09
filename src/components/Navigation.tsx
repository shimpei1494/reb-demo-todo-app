import { Group, Tabs, Title } from '@mantine/core';
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

  const handleTabChange = (value: string | null) => {
    switch (value) {
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

  return (
    <Group justify="space-between" h="100%" px="md">
      <Title order={3}>TODO App</Title>
      <Tabs value={getActiveTab()} onChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab value="todos" leftSection={<IconList size={16} />}>
            TODOs
          </Tabs.Tab>
          <Tabs.Tab value="stats" leftSection={<IconChartBar size={16} />}>
            Stats
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Group>
  );
}

export default Navigation;
