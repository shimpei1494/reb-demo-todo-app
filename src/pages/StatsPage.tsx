import { Badge, Card, Group, Progress, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useTodoContext } from '../context/TodoContext';
import type { TodoStats } from '../types/todo';

function StatsPage() {
  const { getTodoStats } = useTodoContext();
  const stats: TodoStats = getTodoStats();

  return (
    <Stack gap="lg">
      <Title order={2}>Statistics</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <Card withBorder padding="md">
          <Text size="xl" fw={700} c="blue">
            {stats.total}
          </Text>
          <Text size="sm" c="dimmed">
            Total TODOs
          </Text>
        </Card>

        <Card withBorder padding="md">
          <Text size="xl" fw={700} c="green">
            {stats.completed}
          </Text>
          <Text size="sm" c="dimmed">
            Completed
          </Text>
        </Card>

        <Card withBorder padding="md">
          <Text size="xl" fw={700} c="orange">
            {stats.pending}
          </Text>
          <Text size="sm" c="dimmed">
            Pending
          </Text>
        </Card>

        <Card withBorder padding="md">
          <Text size="xl" fw={700} c="violet">
            {stats.completionRate.toFixed(1)}%
          </Text>
          <Text size="sm" c="dimmed">
            Completion Rate
          </Text>
        </Card>
      </SimpleGrid>

      <Card withBorder padding="md">
        <Title order={3} mb="md">
          Completion Progress
        </Title>
        <Progress
          value={stats.completionRate}
          size="xl"
          radius="md"
          color={stats.completionRate > 70 ? 'green' : stats.completionRate > 40 ? 'yellow' : 'red'}
          mb="xs"
        />
        <Text size="sm" c="dimmed">
          {stats.completed} of {stats.total} tasks completed
        </Text>
      </Card>

      <Card withBorder padding="md">
        <Title order={3} mb="md">
          Tasks by Priority
        </Title>
        <Stack gap="md">
          <Group justify="space-between">
            <Group>
              <Badge color="red" size="lg">
                High
              </Badge>
              <Text>{stats.byPriority.high} tasks</Text>
            </Group>
            <Progress
              value={stats.total > 0 ? (stats.byPriority.high / stats.total) * 100 : 0}
              size="md"
              radius="md"
              color="red"
              w={200}
            />
          </Group>

          <Group justify="space-between">
            <Group>
              <Badge color="yellow" size="lg">
                Medium
              </Badge>
              <Text>{stats.byPriority.medium} tasks</Text>
            </Group>
            <Progress
              value={stats.total > 0 ? (stats.byPriority.medium / stats.total) * 100 : 0}
              size="md"
              radius="md"
              color="yellow"
              w={200}
            />
          </Group>

          <Group justify="space-between">
            <Group>
              <Badge color="blue" size="lg">
                Low
              </Badge>
              <Text>{stats.byPriority.low} tasks</Text>
            </Group>
            <Progress
              value={stats.total > 0 ? (stats.byPriority.low / stats.total) * 100 : 0}
              size="md"
              radius="md"
              color="blue"
              w={200}
            />
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}

export default StatsPage;
