import { ActionIcon, Badge, Card, Checkbox, Group, Menu, Text } from '@mantine/core';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import type { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const handleToggle = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Card withBorder padding="md" radius="md">
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start">
          <Checkbox checked={todo.completed} onChange={handleToggle} mt={4} />
          <div style={{ flex: 1 }}>
            <Text
              fw={500}
              td={todo.completed ? 'line-through' : undefined}
              c={todo.completed ? 'dimmed' : undefined}
            >
              {todo.title}
            </Text>
            {todo.description && (
              <Text size="sm" c="dimmed" td={todo.completed ? 'line-through' : undefined}>
                {todo.description}
              </Text>
            )}
            <Group gap="xs" mt={4}>
              <Badge color={getPriorityColor(todo.priority)} size="sm">
                {todo.priority}
              </Badge>
              <Text size="xs" c="dimmed">
                Created: {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
              </Text>
              {todo.dueDate && (
                <Text size="xs" c="dimmed">
                  Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                </Text>
              )}
            </Group>
          </div>
        </Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEdit size={14} />}>Edit</Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={() => onDelete(todo.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );
}

export default TodoItem;
