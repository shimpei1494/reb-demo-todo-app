import { Button, Card, Group, Select, Stack, Switch, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';

function SettingsPage() {
  const { clearCompleted, clearAll } = useTodoContext();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ja');

  const handleClearCompleted = () => {
    clearCompleted();
    notifications.show({
      title: 'Success',
      message: 'Completed tasks have been cleared',
      color: 'green',
    });
  };

  const handleClearAll = () => {
    clearAll();
    notifications.show({
      title: 'Success',
      message: 'All tasks have been cleared',
      color: 'green',
    });
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
      notifications.show({
        title: 'Success',
        message: 'Data exported successfully',
        color: 'green',
      });
    } else {
      notifications.show({
        title: 'Info',
        message: 'No data to export',
        color: 'blue',
      });
    }
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Settings</Title>

      <Card withBorder padding="md">
        <Title order={3} mb="md">
          Appearance
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <Text>Dark Mode</Text>
            <Switch
              checked={darkMode}
              onChange={(event) => setDarkMode(event.currentTarget.checked)}
            />
          </Group>
          <Group justify="space-between">
            <Text>Language</Text>
            <Select
              value={language}
              onChange={(value) => setLanguage(value || 'ja')}
              data={[
                { value: 'ja', label: 'Japanese' },
                { value: 'en', label: 'English' },
              ]}
              w={150}
            />
          </Group>
        </Stack>
      </Card>

      <Card withBorder padding="md">
        <Title order={3} mb="md">
          Data Management
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text>Clear Completed Tasks</Text>
              <Text size="sm" c="dimmed">
                Remove all completed tasks from your list
              </Text>
            </div>
            <Button variant="outline" color="orange" onClick={handleClearCompleted}>
              Clear Completed
            </Button>
          </Group>

          <Group justify="space-between">
            <div>
              <Text>Clear All Tasks</Text>
              <Text size="sm" c="dimmed">
                Remove all tasks from your list (cannot be undone)
              </Text>
            </div>
            <Button variant="outline" color="red" onClick={handleClearAll}>
              Clear All
            </Button>
          </Group>

          <Group justify="space-between">
            <div>
              <Text>Export Data</Text>
              <Text size="sm" c="dimmed">
                Download a backup of your tasks
              </Text>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Export
            </Button>
          </Group>
        </Stack>
      </Card>

      <Card withBorder padding="md">
        <Title order={3} mb="md">
          About
        </Title>
        <Text size="sm" c="dimmed">
          TODO App v1.0.0 - Built with React, TypeScript, and Mantine
        </Text>
      </Card>
    </Stack>
  );
}

export default SettingsPage;
